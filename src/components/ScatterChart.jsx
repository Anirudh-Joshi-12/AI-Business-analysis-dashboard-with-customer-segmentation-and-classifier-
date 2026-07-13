import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const d = payload[0].payload;

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
      <p style={{ color: "#7b7a9d", fontSize: 10, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {d.Segment}
      </p>
      <p style={{ color: "#a0a0c0", fontSize: 11, marginBottom: 2 }}>
        Frequency: {d.Frequency}
      </p>
      <p style={{ color: "#c044f0", fontSize: 13, fontWeight: 600 }}>
        Monetary: {Math.round(d.Monetary)}
      </p>
    </div>
  );
};

export default function ScatterPlot({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[340px] flex items-center justify-center text-[#7b7a9d] rounded-2xl border border-[#2a1a4a]/50">
        No data
      </div>
    );
  }

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
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#a0a0c0] font-semibold">Frequency vs Monetary</p>
        </div>
        <p className="text-[10px] text-[#7b7a9d] mb-4 ml-3">Customer spending distribution across purchase frequency</p>

        <div className="flex-1">
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>

              <CartesianGrid
                strokeDasharray="3 4"
                stroke="rgba(42,26,74,0.25)"
              />

              <XAxis
                dataKey="Frequency"
                tick={{ fill: "#7b7a9d", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(42,26,74,0.4)" }}
                label={{ value: "Frequency", position: "insideBottom", offset: -2, style: { fill: "#7b7a9d", fontSize: 10 } }}
              />

              <YAxis
                dataKey="Monetary"
                tick={{ fill: "#7b7a9d", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(192,68,240,0.15)", strokeWidth: 1 }} />

              <Scatter
                data={data}
                shape={(props) => {
                  const { cx, cy } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill="#C044F0"
                      fillOpacity={0.18}
                      stroke="#c044f0"
                      strokeWidth={1}
                    />
                  );
                }}
              />

            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
