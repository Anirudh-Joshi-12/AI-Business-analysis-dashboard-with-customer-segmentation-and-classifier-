import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from "recharts";

const COLORS = [
  { start: "#f0abfc", end: "#c044f0" },
  { start: "#c044f0", end: "#8B2FC9" },
  { start: "#8B2FC9", end: "#6D28D9" },
  { start: "#6D28D9", end: "#4B0082" }
];

const fmt = (n) =>
  n >= 1000000 ? `${(n / 1000000).toFixed(1)}M`
  : n >= 1000 ? `${(n / 1000).toFixed(1)}K`
  : String(Math.round(n));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "rgba(15,12,28,0.92)",
        border: "1px solid rgba(192,68,240,0.3)",
        borderRadius: 10,
        padding: "10px 14px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <p style={{ color: "#7b7a9d", fontSize: 11, marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#c044f0", fontSize: 14, fontWeight: 700 }}>
        {fmt(payload[0].value)}
      </p>
    </div>
  );
};

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[340px] flex items-center justify-center text-[#7b7a9d] rounded-2xl border border-[#2a1a4a]/50">
        No data
      </div>
    );
  }

  const dataKey = Object.keys(data[0]).find(k => k !== "Segment");

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

      <div className="relative z-10 p-6 h-full flex flex-col">

        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#c044f0] to-[#6D28D9]" />
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#a0a0c0] font-semibold">Revenue by Segment</p>
        </div>
        <p className="text-[10px] text-[#7b7a9d] mb-4 ml-3">Total monetary value per segment</p>

        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barSize={28}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <defs>
                {COLORS.map((c, i) => (
                  <linearGradient key={i} id={`rg-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.start} stopOpacity={1} />
                    <stop offset="100%" stopColor={c.end} stopOpacity={0.5} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                strokeDasharray="3 4"
                stroke="rgba(42,26,74,0.3)"
                vertical={false}
              />

              <XAxis
                dataKey="Segment"
                tick={{ fill: "#7b7a9d", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(42,26,74,0.4)" }}
                tickFormatter={(v) => v.replace(" Customers", "")}
                dy={6}
              />

              <YAxis
                tick={{ fill: "#7b7a9d", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={fmt}
                width={42}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(192,68,240,0.06)", rx: 4 }}
              />

              <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`url(#rg-${i % COLORS.length})`}
                    className="transition-opacity duration-300"
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </Bar>

            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
