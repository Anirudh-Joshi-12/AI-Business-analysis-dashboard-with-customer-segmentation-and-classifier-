import { useState } from "react";

export default function PredictForm({ onPredict, onExplain }) {
  const [form, setForm] = useState({
    recency: "",
    frequency: "",
    monetary: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (type) => {
    const { recency, frequency, monetary } = form;

    if (!recency || !frequency || !monetary) return;

    const payload = {
      recency: Number(recency),
      frequency: Number(frequency),
      monetary: Number(monetary)
    };

    if (type === "predict") onPredict(payload);
    if (type === "explain") onExplain(payload);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: `
          linear-gradient(145deg, rgba(18,18,42,0.85), rgba(10,10,25,0.95)),
          linear-gradient(180deg, rgba(255,255,255,0.05), transparent 40%)
        `,
        border: "1px solid rgba(42,26,74,0.6)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 0 25px rgba(139,47,201,0.08)"
      }}
    >
      {/* top shine */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(192,68,240,0.4), transparent)"
        }}
      />

      <div className="relative z-10 p-6">

        {/* TITLE */}
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#a0a0c0] mb-6">
          Predict Customer Segment
        </p>

        {/* INPUTS */}
        <div className="grid grid-cols-3 gap-5 mb-6">

          {["recency", "frequency", "monetary"].map((field) => (
            <div key={field} className="flex flex-col gap-2">

              <label className="text-[10px] uppercase tracking-[0.25em] text-[#7b7a9d]">
                {field}
              </label>

              <input
                type="number"
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="bg-[#0c0c1e] border border-[#2a1a4a] rounded-lg px-3 py-2 text-white text-sm outline-none transition-all duration-300 focus:border-[#c044f0] focus:shadow-[0_0_10px_#c044f055]"
              />

            </div>
          ))}

        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">

          <button
            onClick={() => handleSubmit("predict")}
            className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300"
            style={{
              background:
                "linear-gradient(90deg, #8B2FC9, #C044F0)",
              boxShadow: "0 0 15px rgba(192,68,240,0.25)"
            }}
          >
            Predict
          </button>

          <button
            onClick={() => handleSubmit("explain")}
            className="flex-1 py-2 rounded-lg text-sm font-semibold text-white border border-[#2a1a4a] bg-[#0c0c1e] transition-all duration-300 hover:border-[#c044f0] hover:shadow-[0_0_10px_#c044f055]"
          >
            Explain
          </button>

        </div>

      </div>
    </div>
  );
}