export default function ResultCard({ data }) {

  if (!data) return null;

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: `
          linear-gradient(145deg, rgba(18,18,42,0.85), rgba(10,10,25,0.95)),
          linear-gradient(180deg, rgba(255,255,255,0.05), transparent 40%)
        `,
        border: "1px solid rgba(42,26,74,0.6)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 0 25px rgba(139,47,201,0.08)"
      }}
    >
      <div className="p-6">

        <p className="text-[10px] uppercase tracking-[0.35em] text-[#a0a0c0] mb-3">
          Prediction
        </p>

        <h2 className="text-white text-2xl font-bold">
          {data.segment}
        </h2>

        <div className="mt-4">
          <p className="text-[#a0a0c0] text-xs uppercase tracking-wide">
            Confidence
          </p>

          <p className="text-[#c044f0] text-lg font-semibold mt-1">
            {(data.confidence * 100).toFixed(1)}%
          </p>
        </div>

      </div>
    </div>
  );
}