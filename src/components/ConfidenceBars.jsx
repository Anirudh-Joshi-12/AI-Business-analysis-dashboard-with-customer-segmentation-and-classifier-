const SEGMENTS = [
  "VIP Customers",
  "Loyal Customers",
  "Regular Customers",
  "Lost Customers"
];

export default function ConfidenceBars({ data }) {

  if (!data) return null;

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: `
          linear-gradient(145deg, rgba(18,18,42,0.85), rgba(10,10,25,0.95))
        `,
        border: "1px solid rgba(42,26,74,0.6)",
        backdropFilter: "blur(14px)"
      }}
    >

      <p className="text-[10px] uppercase tracking-[0.35em] text-[#a0a0c0] mb-5">
        Confidence Distribution
      </p>

      <div className="space-y-4">

        {SEGMENTS.map((segment, i) => {

          const isActive = data.segment === segment;
          const value = isActive ? data.confidence : 0.05;

          return (
            <div key={i}>

              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#a0a0c0]">{segment}</span>
                <span className="text-[#c044f0]">
                  {(value * 100).toFixed(1)}%
                </span>
              </div>

              <div className="w-full h-2 bg-[#0c0c1e] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${value * 100}%`,
                    background:
                      "linear-gradient(90deg, #8B2FC9, #C044F0)"
                  }}
                />
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}