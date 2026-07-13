export default function RFMHeatmap({ data }) {
  if (!data) {
    return (
      <div className="h-[340px] flex items-center justify-center text-[#7b7a9d] rounded-2xl border border-[#2a1a4a]/50">
        No data
      </div>
    );
  }

  const rows = Object.entries(data);

  const SEGMENT_MAP = {
    0: "Lost Customers",
    1: "Loyal Customers",
    2: "Regular Customers",
    3: "VIP Customers"
  };

  const getColor = (value, isMonetary = false) => {
    const norm = Math.log1p(isMonetary ? value / 1000 : value) / 8;
    const opacity = Math.min(0.12 + norm * 0.4, 0.55);
    return `linear-gradient(135deg, rgba(192,68,240,${opacity}), rgba(139,47,201,${opacity * 0.7}))`;
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden h-[360px] transition-all duration-300"
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

      <div className="relative z-10 p-6 h-full flex flex-col">

        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#c044f0] to-[#6D28D9]" />
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#a0a0c0] font-semibold">RFM Averages</p>
        </div>
        <p className="text-[10px] text-[#7b7a9d] mb-4 ml-3">Mean Recency, Frequency & Monetary per segment</p>

        {/* Table */}
        <div className="flex-1 overflow-hidden rounded-xl border border-[#2a1a4a]/60 bg-[#0c0c1e]/50">

          {/* Header */}
          <div className="grid grid-cols-4 bg-[#0c0c1e]/80 text-[#7b7a9d] text-[10px] uppercase tracking-[0.2em] font-semibold border-b border-[#2a1a4a]/80">
            <div className="p-3 border-r border-[#2a1a4a]/40">Segment</div>
            <div className="p-3 text-center border-r border-[#2a1a4a]/40">Recency</div>
            <div className="p-3 text-center border-r border-[#2a1a4a]/40">Frequency</div>
            <div className="p-3 text-center">Monetary</div>
          </div>

          {/* Rows */}
          {rows.map(([segment, values], i) => (
            <div
              key={i}
              className={`grid grid-cols-4 group transition-colors duration-300 hover:bg-[#ffffff04] ${
                i !== rows.length - 1 ? "border-b border-[#1a1a3a]/60" : ""
              }`}
            >
              {/* segment name */}
              <div className="p-3 text-white text-sm border-r border-[#2a1a4a]/40 transition-colors duration-300 group-hover:text-[#c044f0]">
                {SEGMENT_MAP[segment] || segment}
              </div>

              {/* recency */}
              <div className="p-1.5 border-r border-[#2a1a4a]/40">
                <div
                  className="h-full rounded-md flex items-center justify-center text-sm text-white font-medium tabular-nums transition-all duration-300 hover:scale-[1.03]"
                  style={{ background: getColor(values.Recency) }}
                >
                  {values.Recency.toFixed(1)}
                </div>
              </div>

              {/* frequency */}
              <div className="p-1.5 border-r border-[#2a1a4a]/40">
                <div
                  className="h-full rounded-md flex items-center justify-center text-sm text-white font-medium tabular-nums transition-all duration-300 hover:scale-[1.03]"
                  style={{ background: getColor(values.Frequency) }}
                >
                  {values.Frequency.toFixed(1)}
                </div>
              </div>

              {/* monetary */}
              <div className="p-1.5">
                <div
                  className="h-full rounded-md flex items-center justify-center text-sm text-white font-medium tabular-nums transition-all duration-300 hover:scale-[1.03]"
                  style={{ background: getColor(values.Monetary, true) }}
                >
                  {values.Monetary.toFixed(0)}
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
