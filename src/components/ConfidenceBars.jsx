const SEGMENTS = [
  "VIP Customers",
  "Loyal Customers",
  "Regular Customers",
  "Lost Customers"
];

const SEGMENT_COLORS = {
  "VIP Customers": "#c044f0",
  "Loyal Customers": "#8B2FC9",
  "Regular Customers": "#6D28D9",
  "Lost Customers": "#4B0082",
};

export default function ConfidenceBars({ data }) {
  if (!data) return null;

  // Use actual probabilities if available, otherwise fall back to confidence
  const getProbs = (segment) => {
    if (data.all_probabilities && data.all_probabilities[segment] !== undefined) {
      return data.all_probabilities[segment];
    }
    return segment === data.segment ? data.confidence : 0.01;
  };

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
        style={{ background: "linear-gradient(90deg, transparent, rgba(192,68,240,0.3), transparent)" }}
      />

      <div className="relative z-10 p-6">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#c044f0] to-[#6D28D9]" />
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#a0a0c0] font-semibold">Confidence Distribution</p>
        </div>

        <div className="space-y-5">

          {SEGMENTS.map((segment, i) => {
            const isActive = data.segment === segment;
            const value = getProbs(segment);
            const percent = (value * 100).toFixed(1);
            const color = SEGMENT_COLORS[segment] || "#8B2FC9";

            return (
              <div key={i} className="group">

                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className={`flex items-center gap-2 transition-colors duration-300 ${
                    isActive ? "text-white font-semibold" : "text-[#a0a0c0] group-hover:text-[#d8d8e8]"
                  }`}>
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                      />
                    )}
                    {segment.replace(" Customers", "")}
                  </span>
                  <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: isActive ? color : "#7b7a9d" }}
                  >
                    {percent}%
                  </span>
                </div>

                <div className="w-full h-2 bg-[#0c0c1e] rounded-full overflow-hidden border border-[#2a1a4a]/40">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${value * 100}%`,
                      background: isActive
                        ? `linear-gradient(90deg, ${color}aa, ${color})`
                        : "linear-gradient(90deg, rgba(60,50,90,0.8), rgba(80,70,110,0.6))",
                      boxShadow: isActive ? `0 0 10px ${color}55` : "none",
                    }}
                  />
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
