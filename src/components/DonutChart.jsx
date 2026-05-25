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
    <div className="relative rounded-2xl overflow-hidden h-[320px]"
      style={{
        background: "linear-gradient(135deg, rgba(20,10,40,0.9) 0%, rgba(12,12,30,0.95) 100%)",
        border: "1px solid rgba(192,68,240,0.2)",
        boxShadow: "0 0 40px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >

      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(192,68,240,0.18) 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />
      <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", transform: "translate(30%, 30%)" }} />

      {/* Glass shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(192,68,240,0.5), transparent)" }} />

      {/* Content */}
      <div className="relative z-10 p-5 h-full flex flex-col">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#a0a0c0] mb-2">Segments</p>

        <div className="flex flex-1 items-center gap-2">

          {/* Chart */}
          <div className="relative flex-shrink-0" style={{ width: 210, height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {COLORS.map((c, i) => (
                    <linearGradient key={i} id={`dg-${i}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={c.start} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={c.end} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <Pie
                  data={data}
                  dataKey="Customers"
                  nameKey="Segment"
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={95}
                  paddingAngle={3}
                  stroke="none"
                  filter="url(#glow)"
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={`url(#dg-${i % COLORS.length})`} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,5,20,0.85)",
                    border: "1px solid rgba(192,68,240,0.3)",
                    borderRadius: "10px",
                    backdropFilter: "blur(12px)",
                    fontSize: 12,
                    boxShadow: "0 0 20px rgba(192,68,240,0.2)",
                  }}
                  itemStyle={{ color: "#c044f0" }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="absolute w-28 h-28 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(192,68,240,0.12), transparent 70%)" }} />
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#7b7a9d]">Total</span>
              <span className="text-white text-xl font-bold tracking-tight">{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 flex-1">
            {data.map((d, i) => {
              const pct = ((d.Customers / total) * 100).toFixed(0);
              return (
                <div key={i} className="flex items-center gap-2 group">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS[i].start}, ${COLORS[i].end})`,
                      boxShadow: `0 0 6px ${COLORS[i].start}88`,
                    }} />
                  <span className="text-[11px] text-[#a0a0c0] flex-1 leading-tight">
                    {d.Segment.replace(" Customers", "")}
                  </span>
                  <span className="text-[13px] font-bold text-white">{pct}%</span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}