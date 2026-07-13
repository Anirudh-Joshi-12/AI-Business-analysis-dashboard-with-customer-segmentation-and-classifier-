import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  { start: "#f0abfc", end: "#c044f0" },
  { start: "#c044f0", end: "#7c3aed" },
  { start: "#7c3aed", end: "#4b2094" },
  { start: "#4b2094", end: "#1e0a3c" },
];

export default function DonutChart({ data }) {
  const total = data.reduce((acc, d) => acc + d.Customers, 0);

  return (
    <div
      className="relative rounded-2xl overflow-hidden h-[340px] transition-all duration-300"
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

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#c044f0] to-[#6D28D9]" />
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#a0a0c0] font-semibold">Segment Distribution</p>
        </div>
        <p className="text-[10px] text-[#7b7a9d] mb-3 ml-3">Customer count by segment</p>

        <div className="flex flex-1 items-center gap-6">

          {/* Chart */}
          <div className="relative flex-shrink-0" style={{ width: 200, height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {COLORS.map((c, i) => (
                    <linearGradient key={i} id={`dg-${i}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={c.start} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={c.end} stopOpacity={0.75} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={data}
                  dataKey="Customers"
                  nameKey="Segment"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={3}
                  stroke="rgba(10,10,20,0.6)"
                  strokeWidth={1.5}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={`url(#dg-${i % COLORS.length})`} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,12,28,0.92)",
                    border: "1px solid rgba(192,68,240,0.3)",
                    borderRadius: "10px",
                    backdropFilter: "blur(12px)",
                    fontSize: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}
                  itemStyle={{ color: "#c044f0", fontWeight: 600 }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#7b7a9d] mb-0.5">Total</span>
              <span className="text-white text-2xl font-bold tracking-tight">{total.toLocaleString()}</span>
              <span className="text-[9px] text-[#7b7a9d] mt-0.5">customers</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 flex-1">
            {data.map((d, i) => {
              const pct = ((d.Customers / total) * 100).toFixed(1);
              return (
                <div
                  key={i}
                  className="group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 cursor-default"
                  style={{ border: "1px solid transparent" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(192,68,240,0.2)";
                    e.currentTarget.style.background = "rgba(192,68,240,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-125"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS[i % COLORS.length].start}, ${COLORS[i % COLORS.length].end})`,
                      boxShadow: `0 0 8px ${COLORS[i % COLORS.length].start}66`,
                    }}
                  />
                  <span className="text-xs text-[#a0a0c0] flex-1 leading-tight group-hover:text-white transition-colors duration-200">
                    {d.Segment.replace(" Customers", "")}
                  </span>
                  <span className="text-xs font-bold text-white tabular-nums">
                    {d.Customers.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#7b7a9d] tabular-nums w-12 text-right">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
