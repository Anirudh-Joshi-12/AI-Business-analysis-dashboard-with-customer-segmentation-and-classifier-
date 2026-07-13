export default function ShapExplanation({ data }) {
  if (!data || !data.explanation) return null;

  const maxImpact = Math.max(
    ...data.explanation.map(e => Math.abs(e.impact))
  );

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in"
      style={{
        background: "linear-gradient(145deg, rgba(24,22,48,0.65), rgba(14,14,28,0.9))",
        border: "1px solid rgba(42,26,74,0.5)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 4px 24px rgba(124,58,237,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(192,68,240,0.3)";
        e.currentTarget.style.boxShadow = "0 8px 40px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(42,26,74,0.5)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,58,237,0.06), inset 0 1px 0 rgba(255,255,255,0.04)";
      }}
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(192,68,240,0.35), transparent)" }}
      />

      <div className="relative z-10 p-6">

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#c044f0] to-[#6D28D9]" />
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#a0a0c0] font-semibold">SHAP Model Explanation</p>
        </div>
        <p className="text-[10px] text-[#7b7a9d] mb-6 ml-3">How each feature influenced the prediction</p>

        {/* Impact bars */}
        <div className="space-y-5 mb-6">

          {data.explanation.map((item, i) => {
            const width = maxImpact > 0 ? (Math.abs(item.impact) / maxImpact) * 100 : 0;
            const isPositive = item.impact > 0;

            return (
              <div key={i} className="group">

                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:scale-150"
                      style={{
                        background: isPositive ? "#c044f0" : "#6b7280",
                        boxShadow: isPositive ? "0 0 6px rgba(192,68,240,0.5)" : "none",
                      }}
                    />
                    <span className="text-[#a0a0c0] group-hover:text-white transition-colors duration-300">
                      {item.feature}
                    </span>
                    <span
                      className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold"
                      style={{
                        background: isPositive ? "rgba(192,68,240,0.12)" : "rgba(107,114,128,0.12)",
                        color: isPositive ? "#c044f0" : "#9ca3af",
                        border: `1px solid ${isPositive ? "rgba(192,68,240,0.2)" : "rgba(107,114,128,0.2)"}`,
                      }}
                    >
                      {isPositive ? "Pushes Up" : "Pushes Down"}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: isPositive ? "#c044f0" : "#9ca3af" }}
                  >
                    {item.impact > 0 ? "+" : ""}{item.impact.toFixed(3)}
                  </span>
                </div>

                <div className="w-full h-2.5 bg-[#0c0c1e] rounded-full overflow-hidden border border-[#2a1a4a]/40">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${width}%`,
                      background: isPositive
                        ? "linear-gradient(90deg, #8B2FC9, #C044F0)"
                        : "linear-gradient(90deg, #4b5563, #6b7280)",
                      boxShadow: isPositive ? "0 0 8px rgba(192,68,240,0.25)" : "none",
                    }}
                  />
                </div>

              </div>
            );
          })}

        </div>

        {/* Human readable explanation */}
        <div
          className="rounded-xl p-4 border"
          style={{
            background: "rgba(192,68,240,0.04)",
            borderColor: "rgba(192,68,240,0.15)",
          }}
        >
          <p className="text-sm text-white font-semibold mb-3 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#c044f0] shadow-[0_0_6px_#c044f0]" />
            {data.human_readable?.summary}
          </p>

          <div className="space-y-2">
            {data.human_readable?.details?.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#a0a0c0]">
                <span className="text-[#c044f0] mt-0.5 flex-shrink-0">→</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
