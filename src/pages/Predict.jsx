import { useState } from "react";
import Navbar from "../components/Navbar";
import PredictForm from "../components/PredictForm";
import ResultCard from "../components/ResultCard";
import ConfidenceBars from "../components/ConfidenceBars";
import ShapExplanation from "../components/ShapExplanation";

export default function Predict() {
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (payload) => {
    setLoading(true);
    setError(null);
    setExplanation(null);
    try {
      const res = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Prediction failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async (payload) => {
    setExplainLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Explanation failed");
      const data = await res.json();
      setResult(data);
      setExplanation(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
      setExplanation(null);
    } finally {
      setExplainLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(192,68,240,0.04), transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(109,40,217,0.03), transparent 70%)" }}
        />
      </div>

      {/* Navbar */}
      <Navbar apiOnline={true} />

      {/* Main */}
      <main className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-8 space-y-6">

        {/* Page header */}
        <div className="mb-2 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Predict Customer Segment</h1>
          <p className="text-sm text-[#7b7a9d]">
            Enter RFM values to classify a customer &mdash; optionally get a SHAP explanation
          </p>
        </div>

        {/* Form */}
        <div className="animate-fade-in">
          <PredictForm
            onPredict={handlePredict}
            onExplain={handleExplain}
          />
        </div>

        {/* Loading state */}
        {(loading || explainLoading) && (
          <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#2a1a4a] border-t-[#c044f0] animate-spin" />
            <p className="text-sm text-[#7b7a9d]">
              {explainLoading ? "Generating SHAP explanation..." : "Predicting..."}
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && !explainLoading && (
          <div className="flex flex-col items-center justify-center gap-3 text-center p-8 rounded-2xl border border-red-500/20 bg-red-500/3 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl border border-red-500/30 bg-red-500/5 flex items-center justify-center">
              <span className="text-2xl text-red-400">!</span>
            </div>
            <p className="text-lg font-semibold text-white">Something went wrong</p>
            <p className="text-sm text-[#7b7a9d]">{error}. Make sure the backend is running on port 8000.</p>
          </div>
        )}

        {/* Result + Confidence */}
        {result && !loading && !explainLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ResultCard data={result} />
            <ConfidenceBars data={result} />
          </div>
        )}

        {/* SHAP Explanation */}
        {explanation && !explainLoading && (
          <ShapExplanation data={explanation} />
        )}

      </main>

      {/* Footer */}
      <footer className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-6 border-t border-[#2a1a4a]/30 mt-4">
        <div className="flex items-center justify-between text-[10px] text-[#555570] uppercase tracking-[0.2em]">
          <span>IKIII AI &mdash; Customer Segmentation</span>
          <span>Neural Network + SHAP</span>
        </div>
      </footer>

    </div>
  );
}
