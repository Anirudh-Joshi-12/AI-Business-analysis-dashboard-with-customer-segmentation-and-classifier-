import { useState } from "react";

const FIELDS = [
  {
    name: "recency",
    label: "Recency",
    hint: "Days since last purchase",
    icon: "R",
    min: 0,
  },
  {
    name: "frequency",
    label: "Frequency",
    hint: "Number of purchases",
    icon: "F",
    min: 1,
  },
  {
    name: "monetary",
    label: "Monetary",
    hint: "Total spend (£)",
    icon: "M",
    min: 1,
  },
];

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

  const isDisabled = !form.recency || !form.frequency || !form.monetary;

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "linear-gradient(145deg, rgba(24,22,48,0.65), rgba(14,14,28,0.9))",
        border: "1px solid rgba(42,26,74,0.5)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 4px 24px rgba(124,58,237,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(192,68,240,0.35), transparent)" }}
      />

      <div className="relative z-10 p-6">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#c044f0] to-[#6D28D9]" />
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#a0a0c0] font-semibold">Predict Customer Segment</p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

          {FIELDS.map((field) => (
            <div key={field.name} className="flex flex-col gap-2 group">

              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#7b7a9d] font-semibold">
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-[#c044f0] border border-[#c044f0]/30 bg-[#c044f0]/5 transition-all duration-300 group-hover:border-[#c044f0]/60 group-hover:bg-[#c044f0]/10 group-hover:shadow-[0_0_10px_rgba(192,68,240,0.15)]"
                >
                  {field.icon}
                </span>
                {field.label}
              </label>

              <input
                type="number"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                min={field.min}
                placeholder={field.hint}
                className="bg-[#0c0c1e]/80 border border-[#2a1a4a]/80 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none transition-all duration-300 placeholder:text-[#555560] focus:border-[#c044f0] focus:bg-[#0c0c1e] focus:shadow-[0_0_12px_rgba(192,68,240,0.15)] hover:border-[#3a2a5a]"
              />

              <span className="text-[10px] text-[#555570] group-hover:text-[#7b7a9d] transition-colors duration-300">
                {field.hint}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">

          <button
            onClick={() => handleSubmit("predict")}
            disabled={isDisabled}
            className="group flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            style={{
              background: "linear-gradient(135deg, #8B2FC9, #C044F0)",
              boxShadow: "0 4px 16px rgba(192,68,240,0.25)",
            }}
            onMouseEnter={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(192,68,240,0.4)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(192,68,240,0.25)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Predict Segment
          </button>

          <button
            onClick={() => handleSubmit("explain")}
            disabled={isDisabled}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-[#d8d8e8] border border-[#2a1a4a]/80 bg-[#0c0c1e]/80 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c044f0]/60 hover:text-white hover:shadow-[0_0_16px_rgba(192,68,240,0.1)]"
          >
            Explain + Predict
          </button>

        </div>
      </div>
    </div>
  );
}
