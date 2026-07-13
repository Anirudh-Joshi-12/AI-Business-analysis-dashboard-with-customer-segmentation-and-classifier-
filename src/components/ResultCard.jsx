export default function ResultCard({ data }) {
  if (!data) return null;

  const SEGMENT_COLORS = {
    "VIP Customers": "#c044f0",
    "Loyal Customers": "#8B2FC9",
    "Regular Customers": "#6D28D9",
    "Lost Customers": "#4B0082",
  };

  const color = SEGMENT_COLORS[data.segment] || "#8B2FC9";
  const confidence = (data.confidence * 100).toFixed(1);

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in"
      style={{
        background: `linear-gradient(145deg, rgba(24,22,48,0.7), rgba(14,14,28,0.92))`,
        border: `1px solid ${color}44`,
        backdropFilter: "blur(16px)",
        boxShadow: `0 4px 24px rgba(124,58,237,0.08), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}88`;
        e.currentTarget.style.boxShadow = `0 8px 40px ${color}22, inset 0 1px 0 rgba(255,255,255,0.05)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}44`;
        e.currentTarget.style.boxShadow = `0 4px 24px rgba(124,58,237,0.08), inset 0 1px 0 rgba(255,255,255,0.04)`;
      }}
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }}
      />

      {/* Soft accent glow */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none opacity-20"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      />

      <div className="relative z-10 p-6">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#c044f0] to-[#6D28D9]" />
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#a0a0c0] font-semibold">Prediction Result</p>
        </div>

        {/* Segment badge */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${color}22, ${color}08)`,
              borderColor: `${color}55`,
              color: color,
              boxShadow: `0 0 16px ${color}22`,
            }}
          >
            {data.segment.charAt(0)}
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold leading-tight">
              {data.segment}
            </h2>
            <p className="text-[10px] text-[#7b7a9d] uppercase tracking-[0.15em] mt-0.5">
              Classified Segment
            </p>
          </div>
        </div>

        {/* Confidence */}
        <div className="border-t border-[#2a1a4a]/60 pt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#a0a0c0] text-xs uppercase tracking-wide font-medium">
              Confidence
            </p>
            <p
              className="text-lg font-bold tabular-nums"
              style={{ color }}
            >
              {confidence}%
            </p>
          </div>

          {/* Confidence bar */}
          <div className="w-full h-1.5 bg-[#0c0c1e] rounded-full overflow-hidden border border-[#2a1a4a]/40">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${confidence}%`,
                background: `linear-gradient(90deg, ${color}aa, ${color})`,
                boxShadow: `0 0 10px ${color}55`,
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
