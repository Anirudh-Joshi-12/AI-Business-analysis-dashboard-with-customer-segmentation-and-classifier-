from contextlib import asynccontextmanager
from typing import Any

import numpy as np
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from ML import (
    load_artifacts,
    run_pipeline,
    predict_customer_segment,
    explain_prediction,
    create_shap_explainer,
    generate_dashboard_data,
    load_data,
    create_rfm,
    preprocess_features,
    train_kmeans,
    label_segments,
)

state: dict[str, Any] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        model, scaler, encoder = load_artifacts()
        state["model"]    = model
        state["scaler"]   = scaler
        state["encoder"]  = encoder
        state["ready"]    = True
        state["explainer"] = None

        df  = load_data("data.csv")
        rfm = create_rfm(df)
        _, rfm_pca, scaler_temp, _ = preprocess_features(rfm)
        rfm, _, _ = train_kmeans(rfm, rfm_pca)
        rfm = label_segments(rfm)
        state["dashboard"] = generate_dashboard_data(rfm)

    except Exception as e:
        print(f"Startup error: {e}")
        state["ready"] = False
    yield
    state.clear()


app = FastAPI(title="Customer Segmentation API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CustomerInput(BaseModel):
    recency:   float = Field(..., ge=0)
    frequency: float = Field(..., gt=0)
    monetary:  float = Field(..., gt=0)

    @field_validator("recency", "frequency", "monetary")
    @classmethod
    def must_be_finite(cls, v):
        if not np.isfinite(v):
            raise ValueError("Value must be finite.")
        return v


class TrainRequest(BaseModel):
    data_path: str = Field("data.csv")


def require_model():
    if not state.get("ready"):
        raise HTTPException(status_code=503, detail="Model not loaded. POST /api/train first.")


def get_explainer():
    if state.get("explainer") is None:
        if not state.get("ready"):
            raise HTTPException(status_code=503, detail="Model not loaded. POST /api/train first.")
        state["explainer"] = create_shap_explainer(state["model"])
    return state["explainer"]


@app.get("/api/health")
def health():
    return {"status": "ok", "model_loaded": state.get("ready", False)}


@app.post("/api/train")
def train(req: TrainRequest, background_tasks: BackgroundTasks):
    def _train():
        result = run_pipeline(req.data_path)
        model, scaler, encoder = load_artifacts()
        state["model"]     = model
        state["scaler"]    = scaler
        state["encoder"]   = encoder
        state["ready"]     = True
        state["explainer"] = None
        state["dashboard"] = result["dashboard"]
    background_tasks.add_task(_train)
    return {"message": "Training started. Check /api/health for readiness."}


@app.get("/api/dashboard")
def dashboard():
    require_model()
    if state.get("dashboard") is None:
        raise HTTPException(status_code=404, detail="No dashboard data. POST /api/train first.")
    return state["dashboard"]


@app.post("/api/predict")
def predict(customer: CustomerInput):
    require_model()
    try:
        return predict_customer_segment(
            state["model"], state["encoder"], state["scaler"],
            customer.recency, customer.frequency, customer.monetary,
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


@app.post("/api/explain")
def explain(customer: CustomerInput):
    require_model()
    explainer = get_explainer()
    try:
        return explain_prediction(
            explainer, state["model"], state["encoder"], state["scaler"],
            customer.recency, customer.frequency, customer.monetary,
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)