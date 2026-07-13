export default function StatCard({ title, value }) {
  const styles = {
    "VIP Customers":     { accent: "#c044f0", glow: "rgba(192,68,240,0.18)" },
    "Loyal Customers":   { accent: "#8B2FC9", glow: "rgba(139,47,201,0.16)" },
    "Regular Customers": { accent: "#6D28D9", glow: "rgba(109,40,217,0.14)" },
    "Lost Customers":    { accent: "#4B0082", glow: "rgba(75,0,130,0.12)" },
  };

  const { accent, glow } = styles[title] || { accent: "#8B2FC9", glow: "rgba(139,47,201,0.15)" };

  return (
    <div
      className="group relative rounded-2xl p-5 transition-all duration-300 cursor-default overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(24,22,48,0.65), rgba(14,14,28,0.9))",
        border: "1px solid rgba(42,26,74,0.5)",
        backdropFilter: "blur(16px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent}66`;
        e.currentTarget.style.boxShadow = `0 8px 40px ${glow}, inset 0 1px 0 rgba(255,255,255,0.05)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(42,26,74,0.5)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Soft accent gradient */}
      <div
        className="absolute inset-0 rounded-2xl opacity-10 transition-opacity duration-300 group-hover:opacity-25 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top left, ${accent}, transparent 60%)`,
        }}
      />

      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-30 group-hover:opacity-60 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to bottom, ${accent}, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 pl-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#a0a0c0] mb-2 font-medium">
          {title}
        </p>
        <h2
          className="text-2xl font-bold text-white transition-all duration-300 group-hover:tracking-wide"
          style={{ transition: "letter-spacing 0.3s ease" }}
        >
          {value.toLocaleString()}
        </h2>
      </div>
    </div>
  );
}
