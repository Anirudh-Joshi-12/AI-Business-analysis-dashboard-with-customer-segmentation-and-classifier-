import { useState } from "react";
import Navbar from "../components/navbar";
import PredictForm from "../components/PredictForm";
import ResultCard from "../components/ResultCard";
import ConfidenceBars from "../components/ConfidenceBars";
import ShapExplanation from "../components/ShapExplanation";

export default function Predict() {

  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState(null);

  const handlePredict = async (payload) => {
    const res = await fetch("http://localhost:8000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    setResult(data);
    setExplanation(null);
  };

  const handleExplain = async (payload) => {
    const res = await fetch("http://localhost:8000/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    setResult(data);
    setExplanation(data);
  };

  return (
    <div className="min-h-screen bg-[#04040d] text-white">
      <Navbar apiOnline={true} />

      <main className="max-w-[1400px] mx-auto px-8 py-8 space-y-8">

        {/* FORM */}
        <PredictForm
          onPredict={handlePredict}
          onExplain={handleExplain}
        />

        {/* RESULT + CONFIDENCE */}
        {result && (
          <div className="grid grid-cols-2 gap-6">
            <ResultCard data={result} />
            <ConfidenceBars data={result} />
          </div>
        )}

        {/* EXPLANATION */}
        {explanation && (
          <ShapExplanation data={explanation} />
        )}

      </main>
    </div>
  );
}