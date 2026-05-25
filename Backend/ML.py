import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import silhouette_score
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense, Input
import shap
import random
import joblib
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
np.random.seed(42)
tf.random.set_seed(42)
random.seed(42)
 
MODEL_PATH   = "model.keras"
SCALER_PATH  = "scaler.pkl"
ENCODER_PATH = "encoder.pkl"
PCA_PATH     = "pca.pkl"
KMEANS_PATH  = "kmeans.pkl"
SHAP_BG_PATH = "shap_background.pkl"
 
 
def load_data(path):
    df = pd.read_csv(path, encoding="latin1")
    df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])
    df["TotalAmount"] = df["Quantity"] * df["UnitPrice"]
    df = df[(df["Quantity"] > 0) & (df["UnitPrice"] > 0)]
    df = df.dropna(subset=["CustomerID"])
    return df
 
 
def create_rfm(df):
    snapshot_date = df["InvoiceDate"].max()
    rfm = df.groupby("CustomerID").agg(
        LastPurchase=("InvoiceDate", "max"),
        Frequency=("InvoiceNo", "nunique"),
        Monetary=("TotalAmount", "sum"),
    ).reset_index()
    rfm["Recency"] = (snapshot_date - rfm["LastPurchase"]).dt.days
    return rfm[["CustomerID", "Recency", "Frequency", "Monetary"]]
 
 
def preprocess_features(rfm):
    scaler = StandardScaler()
    rfm_scaled = scaler.fit_transform(rfm[["Recency", "Frequency", "Monetary"]].values)
    pca = PCA(n_components=2)
    rfm_pca = pca.fit_transform(rfm_scaled)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(pca, PCA_PATH)
    return rfm_scaled, rfm_pca, scaler, pca
 
 
def train_kmeans(rfm, rfm_pca):
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    rfm["Cluster"] = kmeans.fit_predict(rfm_pca)
    score = silhouette_score(rfm_pca, rfm["Cluster"])
    joblib.dump(kmeans, KMEANS_PATH)
    return rfm, score, kmeans
 
 
def label_segments(rfm):
    stats = rfm.groupby("Cluster").agg(
        Avg_Monetary=("Monetary", "mean"),
        Avg_Recency=("Recency", "mean"),
        Avg_Frequency=("Frequency", "mean"),
    )
    cluster_names = {}
    remaining = set(stats.index)
    vip = stats["Avg_Monetary"].idxmax()
    cluster_names[vip] = "VIP Customers"
    remaining.discard(vip)
    loyal = stats.loc[list(remaining), "Avg_Recency"].idxmin()
    cluster_names[loyal] = "Loyal Customers"
    remaining.discard(loyal)
    regular = stats.loc[list(remaining), "Avg_Frequency"].idxmax()
    cluster_names[regular] = "Regular Customers"
    remaining.discard(regular)
    for c in remaining:
        cluster_names[c] = "Lost Customers"
    rfm["Segment"] = rfm["Cluster"].map(cluster_names)
    return rfm
 
 
def prepare_classification_data(rfm, scaler):
    X = rfm[["Recency", "Frequency", "Monetary"]].values
    X_scaled = scaler.transform(X)
    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(rfm["Segment"])
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_encoded, test_size=0.2, random_state=42
    )
    joblib.dump(encoder, ENCODER_PATH)
    joblib.dump(X_train[:100], SHAP_BG_PATH)
    return X_train, X_test, y_train, y_test, encoder
 
 
def train_classifier(X_train, y_train):
    model = Sequential([
        Input(shape=(3,)),
        Dense(32, activation="relu"),
        Dense(16, activation="relu"),
        Dense(8,  activation="relu"),
        Dense(4,  activation="softmax"),
    ])
    model.compile(
        optimizer="adam",
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.fit(X_train, y_train, epochs=50, batch_size=16, verbose=0, validation_split=0.1)
    return model
 
 
def evaluate_classifier(model, X_test, y_test):
    _, accuracy = model.evaluate(X_test, y_test, verbose=0)
    return accuracy
 
 
def predict_customer_segment(model, encoder, scaler, recency, frequency, monetary):
    if recency < 0 or frequency <= 0 or monetary <= 0:
        raise ValueError("recency must be >=0; frequency and monetary must be >0.")
    sample = np.array([[recency, frequency, monetary]], dtype=float)
    sample_scaled = scaler.transform(sample)
    probas = model.predict(sample_scaled, verbose=0)[0]
    predicted_class = int(np.argmax(probas))
    return {
        "segment": encoder.inverse_transform([predicted_class])[0],
        "confidence": round(float(np.max(probas)), 4),
        "all_probabilities": {
            str(encoder.inverse_transform([i])[0]): round(float(p), 4)
            for i, p in enumerate(probas)
        },
    }
 
 
def create_shap_explainer(model):
    background = joblib.load(SHAP_BG_PATH)
    predict_fn = lambda x: model.predict(x, verbose=0)
    explainer = shap.KernelExplainer(predict_fn, background[:20])
    return explainer
 
 
def explain_prediction(explainer, model, encoder, scaler, recency, frequency, monetary):
    if recency < 0 or frequency <= 0 or monetary <= 0:
        raise ValueError("recency must be >=0; frequency and monetary must be >0.")
    sample = np.array([[recency, frequency, monetary]], dtype=float)
    sample_scaled = scaler.transform(sample)
    prediction = predict_customer_segment(model, encoder, scaler, recency, frequency, monetary)
    pred_class = list(prediction["all_probabilities"].keys()).index(prediction["segment"])
 
    shap_values = explainer.shap_values(sample_scaled, nsamples=100, silent=True)
    sv = np.array(shap_values)
    values = sv[0, :, pred_class]
 
    features = ["Recency", "Frequency", "Monetary"]
    explanation = sorted(
        [{"feature": features[i], "impact": round(float(values[i]), 6)} for i in range(3)],
        key=lambda x: abs(x["impact"]),
        reverse=True,
    )
    return {
        **prediction,
        "explanation": explanation,
        "human_readable": {
            "summary": f"Customer classified as '{prediction['segment']}'",
            "details": [
                f"{item['feature']} {'positively' if item['impact'] > 0 else 'negatively'} influenced the prediction (impact: {item['impact']:+.4f})."
                for item in explanation
            ],
        },
    }
 
 
def generate_dashboard_data(rfm):
    summary = rfm.groupby("Segment").agg(
        Avg_Frequency=("Frequency", "mean"),
        Avg_Monetary=("Monetary", "mean"),
        Avg_Recency=("Recency", "mean"),
        Customers=("CustomerID", "count"),
    ).round(2).reset_index()
    distribution = rfm["Segment"].value_counts().reset_index()
    distribution.columns = ["Segment", "Customers"]
    revenue = rfm.groupby("Segment")["Monetary"].sum().reset_index()
    revenue.columns = ["Segment", "TotalRevenue"]
    scatter = rfm[["Frequency", "Monetary", "Segment"]].to_dict(orient="records")
    heatmap = rfm.groupby("Segment")[["Recency", "Frequency", "Monetary"]].mean().reset_index()
    return {
        "summary":      summary.to_dict(orient="records"),
        "distribution": distribution.to_dict(orient="records"),
        "revenue":      revenue.to_dict(orient="records"),
        "scatter":      scatter,
        "heatmap":      heatmap.to_dict(orient="records"),
    }
 
 
def save_artifacts(model, scaler, encoder):
    model.save(MODEL_PATH)
    joblib.dump(scaler,  SCALER_PATH)
    joblib.dump(encoder, ENCODER_PATH)
 
 
def load_artifacts():
    missing = [p for p in [MODEL_PATH, SCALER_PATH, ENCODER_PATH, SHAP_BG_PATH] if not os.path.exists(p)]
    if missing:
        raise FileNotFoundError(f"Missing artifacts: {missing}. Run run_pipeline() first.")
    return load_model(MODEL_PATH), joblib.load(SCALER_PATH), joblib.load(ENCODER_PATH)
 
 
def run_pipeline(path="data.csv"):
    df  = load_data(path)
    rfm = create_rfm(df)
    _, rfm_pca, scaler, _ = preprocess_features(rfm)
    rfm, score, _  = train_kmeans(rfm, rfm_pca)
    rfm            = label_segments(rfm)
    X_train, X_test, y_train, y_test, encoder = prepare_classification_data(rfm, scaler)
    model    = train_classifier(X_train, y_train)
    accuracy = evaluate_classifier(model, X_test, y_test)
    save_artifacts(model, scaler, encoder)
    return {
        "silhouette_score":    round(score, 3),
        "classifier_accuracy": round(accuracy, 3),
        "dashboard":           generate_dashboard_data(rfm),
    }
 
 
if __name__ == "__main__":
    TRAIN = False
    if TRAIN:
        print(run_pipeline())
    model, scaler, encoder = load_artifacts()
    explainer = create_shap_explainer(model)
    print(explain_prediction(explainer, model, encoder, scaler, 10, 20, 150))