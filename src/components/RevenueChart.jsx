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
        background: "rgba(10,10,15,0.8)",
        border: "1px solid rgba(192,68,240,0.25)",
        borderRadius: 12,
        padding: "10px 14px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 20px rgba(192,68,240,0.15)"
      }}
    >
      <p style={{ color: "#a0a0c0", fontSize: 11 }}>{label}</p>
      <p style={{ color: "#c044f0", fontSize: 14, fontWeight: 700 }}>
        £{fmt(payload[0].value)}
      </p>
    </div>
  );
};

export default function RevenueChart({ data }) {

  // ✅ safety check
  if (!data || data.length === 0) {
    return (
      <div className="h-[320px] flex items-center justify-center text-[#a0a0c0]">
        No data
      </div>
    );
  }

  // ✅ auto-detect correct numeric key
  const dataKey = Object.keys(data[0]).find(k => k !== "Segment");

  return (
    <div
      className="relative rounded-2xl overflow-hidden h-[320px]"
      style={{
        background: "rgba(18,18,42,0.6)",
        border: "1px solid rgba(42,26,74,0.6)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 0 30px rgba(139,47,201,0.12)"
      }}
    >

      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-44 h-44 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(192,68,240,0.18), transparent 70%)",
          transform: "translate(30%, -30%)"
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-36 h-36 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,47,201,0.15), transparent 70%)",
          transform: "translate(-30%, 30%)"
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">

        <p className="text-[10px] uppercase tracking-[0.35em] text-[#a0a0c0] mb-4">
          Revenue
        </p>

        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barSize={26}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >

              {/* Gradients */}
              <defs>
                {COLORS.map((c, i) => (
                  <linearGradient key={i} id={`rg-${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={c.start} stopOpacity={1} />
                    <stop offset="50%" stopColor={c.start} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={c.end} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>

              {/* Grid */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(42,26,74,0.25)"
                vertical={false}
              />

              {/* X Axis */}
              <XAxis
                dataKey="Segment"
                tick={{ fill: "#7b7a9d", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.replace(" Customers", "")}
                dy={8}
              />

              {/* Y Axis */}
              <YAxis
                tick={{ fill: "#7b7a9d", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={fmt}
                width={40}
              />

              {/* Tooltip */}
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(192,68,240,0.06)" }}
              />

              {/* Bars */}
              <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={`url(#rg-${i % COLORS.length})`}
                    style={{
                      filter: `drop-shadow(0 4px 12px ${
                        COLORS[i % COLORS.length].start
                      }55)`
                    }}
                    className="transition-all duration-300 hover:opacity-100 opacity-90"
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