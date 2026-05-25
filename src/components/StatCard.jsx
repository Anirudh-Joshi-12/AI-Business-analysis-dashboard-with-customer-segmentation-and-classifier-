export default function StatCard({ title, value }) {

  const styles = {
    "VIP Customers": "#C044F0",
    "Loyal Customers": "#8B2FC9",
    "Regular Customers": "#6D28D9",
    "Lost Customers": "#4B0082"
  };

  const accent = styles[title] || "#8B2FC9";

  return (
    <div
      className="group relative rounded-xl p-5 border border-[#2a1a4a] backdrop-blur-md transition-all duration-300"
      style={{
        background: "rgba(18, 18, 42, 0.65)"
      }}
    >

      {/* BASE SOFT GRADIENT */}
      <div
        className="absolute inset-0 rounded-xl opacity-15 transition-all duration-300 group-hover:opacity-40"
        style={{
          background: `radial-gradient(circle at top left, ${accent}, transparent 65%)`
        }}
      />

      {/* HOVER GLOW */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{
          boxShadow: `0 0 40px ${accent}55`
        }}
      />

      {/* BORDER GLOW ON HOVER */}
      <div
        className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[1px] transition-all duration-300"
        style={{
          borderColor: `${accent}55`
        }}
      />

      {/* LEFT ACCENT BAR */}
      <div
        className="absolute left-0 top-0 h-full w-[3px] rounded-l-xl opacity-60 group-hover:opacity-100 transition-all duration-300"
        style={{
          background: `linear-gradient(to bottom, ${accent}, transparent)`
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 pl-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a0a0c0] mb-2">
          {title}
        </p>

        <h2 className="text-2xl font-bold text-white group-hover:tracking-wider transition-all duration-300">
          {value}
        </h2>
      </div>

    </div>
  );
}