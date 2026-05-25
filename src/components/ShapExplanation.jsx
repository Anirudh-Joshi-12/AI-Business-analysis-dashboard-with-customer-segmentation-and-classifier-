export default function ShapExplanation({ data }) {

  if (!data || !data.explanation) return null;

  const maxImpact = Math.max(
    ...data.explanation.map(e => Math.abs(e.impact))
  );

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

      <p className="text-[10px] uppercase tracking-[0.35em] text-[#a0a0c0] mb-6">
        Model Explanation
      </p>

      {/* Bars */}
      <div className="space-y-4 mb-6">

        {data.explanation.map((item, i) => {

          const width = (Math.abs(item.impact) / maxImpact) * 100;

          return (
            <div key={i}>

              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#a0a0c0]">{item.feature}</span>
                <span className="text-white">
                  {item.impact.toFixed(3)}
                </span>
              </div>

              <div className="w-full h-2 bg-[#0c0c1e] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${width}%`,
                    background:
                      item.impact > 0
                        ? "linear-gradient(90deg, #C044F0, #8B2FC9)"
                        : "linear-gradient(90deg, #444, #777)"
                  }}
                />
              </div>

            </div>
          );
        })}

      </div>

      {/* Human readable */}
      <div className="text-sm text-[#a0a0c0] space-y-2">
        <p className="text-white font-semibold">
          {data.human_readable?.summary}
        </p>

        {data.human_readable?.details?.map((d, i) => (
          <p key={i}>• {d}</p>
        ))}
      </div>

    </div>
  );
}