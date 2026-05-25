export default function RFMHeatmap({ data }) {

  if (!data) {
    return (
      <div className="h-[320px] flex items-center justify-center text-[#a0a0c0]">
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

  const getColor = (value) => {
    const norm = Math.log1p(value) / 8;
    const opacity = Math.min(0.18 + norm * 0.45, 0.6);

    return `linear-gradient(
      135deg,
      rgba(192,68,240,${opacity}),
      rgba(139,47,201,${opacity * 0.7})
    )`;
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden h-[340px]"
      style={{
        background: `
          linear-gradient(135deg, rgba(20,10,40,0.9), rgba(10,10,25,0.95)),
          radial-gradient(circle at 15% 20%, rgba(192,68,240,0.18), transparent 40%),
          radial-gradient(circle at 85% 80%, rgba(139,47,201,0.15), transparent 50%)
        `,
        border: "1px solid rgba(192,68,240,0.18)",
        backdropFilter: "blur(16px)",
        boxShadow: `
          0 0 40px rgba(124,58,237,0.12),
          inset 0 1px 0 rgba(255,255,255,0.04)
        `
      }}
    >

      {/* ambient glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(192,68,240,0.2), transparent 70%)",
          transform: "translate(30%, -30%)"
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)",
          transform: "translate(-30%, 30%)"
        }}
      />

      {/* shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(192,68,240,0.5), transparent)"
        }}
      />

      {/* content */}
      <div className="relative z-10 p-5 h-full flex flex-col">

        <p className="text-[10px] uppercase tracking-[0.35em] text-[#a0a0c0] mb-4">
          RFM Heatmap
        </p>

        <div className="flex-1 overflow-hidden rounded-xl border border-[#2a1a4a]/60 backdrop-blur-md">

          {/* header */}
          <div className="grid grid-cols-4 bg-[#0c0c1e]/80 text-[#a0a0c0] text-[10px] uppercase tracking-[0.25em]">
            <div className="p-3">Segment</div>
            <div className="p-3 text-center">Recency</div>
            <div className="p-3 text-center">Frequency</div>
            <div className="p-3 text-center">Monetary</div>
          </div>

          {/* rows */}
          {rows.map(([segment, values], i) => (
            <div
              key={i}
              className="grid grid-cols-4 border-t border-[#1a1a3a] group transition-all duration-300 hover:bg-[#ffffff05]"
            >

              {/* segment (FIX APPLIED HERE) */}
              <div className="p-3 text-white text-sm transition-all duration-300 group-hover:text-[#c044f0]">
                {SEGMENT_MAP[segment] || segment}
              </div>

              {/* recency */}
              <div
                className="p-3 text-center rounded-md m-[2px] transition-all duration-300"
                style={{
                  background: getColor(values.Recency),
                  boxShadow: "0 0 10px rgba(192,68,240,0.15)"
                }}
              >
                {values.Recency.toFixed(1)}
              </div>

              {/* frequency */}
              <div
                className="p-3 text-center rounded-md m-[2px] transition-all duration-300"
                style={{
                  background: getColor(values.Frequency),
                  boxShadow: "0 0 10px rgba(192,68,240,0.15)"
                }}
              >
                {values.Frequency.toFixed(1)}
              </div>

              {/* monetary */}
              <div
                className="p-3 text-center rounded-md m-[2px] transition-all duration-300"
                style={{
                  background: getColor(values.Monetary / 1000),
                  boxShadow: "0 0 12px rgba(192,68,240,0.18)"
                }}
              >
                {values.Monetary.toFixed(0)}
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}