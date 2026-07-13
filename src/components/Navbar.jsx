import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ apiOnline }) {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname === "/" ? "dashboard" : "predict";

  const navItems = [
    { key: "dashboard", label: "Dashboard", path: "/" },
    { key: "predict", label: "Predict", path: "/predict" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center px-8 md:px-10 h-16 bg-[#0a0a12]/90 backdrop-blur-xl border-b border-[#2a1a4a]/50">

      {/* Shimmer accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(192,68,240,0.2) 30%, rgba(192,68,240,0.2) 70%, transparent)",
        }}
      />

      {/* LEFT — Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#c044f0]/30 bg-gradient-to-br from-[#c044f0]/20 to-[#6D28D9]/10 transition-all duration-300 hover:border-[#c044f0]/60 hover:shadow-[0_0_20px_rgba(192,68,240,0.25)] cursor-default"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#c044f0] shadow-[0_0_10px_#c044f0]" />
          </div>
        </div>
        <span className="text-white text-lg font-bold tracking-[0.12em] uppercase select-none">
          IKIII<span className="text-[#c044f0]">AI</span>
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-10 ml-auto">

        {/* NAV BUTTONS */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`group relative text-xs uppercase tracking-[0.2em] font-semibold transition-colors duration-300 px-1 py-1
                ${page === item.key
                  ? "text-white"
                  : "text-[#7b7a9d] hover:text-[#d8d8e8]"
                }`}
            >
              {item.label}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-[#8B2FC9] to-[#C044F0] transition-all duration-300
                  ${page === item.key
                    ? "w-full opacity-100 shadow-[0_0_10px_#c044f0]"
                    : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60"
                  }`}
              />
            </button>
          ))}
        </div>

        {/* API STATUS */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-default"
          style={{
            borderColor: apiOnline
              ? "rgba(192,68,240,0.25)"
              : "rgba(80,80,100,0.2)",
            background: apiOnline
              ? "rgba(192,68,240,0.04)"
              : "rgba(60,60,80,0.03)",
          }}
        >
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300
              ${apiOnline
                ? "bg-[#c044f0] shadow-[0_0_8px_#c044f0]"
                : "bg-[#555]"
              }`}
          />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#a0a0c0] font-medium">
            API {apiOnline ? "Online" : "Offline"}
          </span>
        </div>

      </div>
    </nav>
  );
}
