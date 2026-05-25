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
        background: "rgba(12,12,20,0.85)",
        border: "1px solid rgba(192,68,240,0.25)",
        borderRadius: 10,
        padding: "8px 12px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 20px rgba(192,68,240,0.12)"
      }}
    >
      <p style={{ color: "#a0a0c0", fontSize: 11 }}>
        Freq: {d.Frequency}
      </p>
      <p style={{ color: "#c044f0", fontSize: 13, fontWeight: 600 }}>
        ₹{Math.round(d.Monetary)}
      </p>
    </div>
  );
};

export default function ScatterPlot({ data }) {

  if (!data || data.length === 0) {
    return (
      <div className="h-[320px] flex items-center justify-center text-[#a0a0c0]">
        No data
      </div>
    );
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden h-[320px]"
      style={{
        background: `
          linear-gradient(145deg, rgba(18,18,42,0.85), rgba(10,10,25,0.95)),
          
          /* glossy highlight */
          linear-gradient(
            180deg,
            rgba(255,255,255,0.06) 0%,
            rgba(255,255,255,0.02) 20%,
            transparent 40%
          ),

          /* modular grid */
          repeating-linear-gradient(
            90deg,
            rgba(255,255,255,0.02) 0px,
            rgba(255,255,255,0.02) 1px,
            transparent 1px,
            transparent 60px
          ),
          repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.015) 0px,
            rgba(255,255,255,0.015) 1px,
            transparent 1px,
            transparent 60px
          ),

          /* subtle purple depth */
          radial-gradient(circle at 20% 20%, rgba(192,68,240,0.08), transparent 40%),
          radial-gradient(circle at 85% 80%, rgba(139,47,201,0.06), transparent 50%)
        `,
        border: "1px solid rgba(42,26,74,0.6)",
        backdropFilter: "blur(14px)",
        boxShadow: `
          0 0 25px rgba(139,47,201,0.08),
          inset 0 1px 0 rgba(255,255,255,0.05)
        `
      }}
    >

      {/* subtle top shine */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(192,68,240,0.4), transparent)"
        }}
      />

      <div className="relative z-10 p-5 h-full flex flex-col">

        <p className="text-[10px] uppercase tracking-[0.35em] text-[#a0a0c0] mb-4">
          Frequency vs Monetary
        </p>

        <div className="flex-1">
          <ResponsiveContainer>
            <ScatterChart>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(42,26,74,0.2)"
              />

              <XAxis
                dataKey="Frequency"
                tick={{ fill: "#7b7a9d", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                dataKey="Monetary"
                tick={{ fill: "#7b7a9d", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Scatter
                data={data}
                shape={(props) => {
                  const { cx, cy } = props;

                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4.5}
                      fill="#C044F0"
                      stroke="#ffffff22"
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