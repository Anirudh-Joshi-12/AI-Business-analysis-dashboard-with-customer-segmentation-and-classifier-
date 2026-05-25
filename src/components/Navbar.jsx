import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ apiOnline }) {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname === "/" ? "dashboard" : "predict";

  return (
    <nav className="sticky top-0 z-50 flex items-center px-10 h-[64px] bg-[#000000] border-b border-[#2a1a4a]">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#c044f0] shadow-[0_0_12px_#c044f0]" />
        <span className="text-white text-lg font-bold tracking-[0.15em] uppercase">
          IKIII<span className="text-[#c044f0]">AI</span>
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-8 ml-auto">

        {/* NAV BUTTONS */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate("/")}
            className={`text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-200 relative
              ${page === "dashboard"
                ? "text-white"
                : "text-[#7b7a9d] hover:text-white"
              }`}
          >
            Dashboard
            {page === "dashboard" && (
              <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-gradient-to-r from-[#8B2FC9] to-[#C044F0] shadow-[0_0_10px_#c044f0]" />
            )}
          </button>

          <button
            onClick={() => navigate("/predict")}
            className={`text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-200 relative
              ${page === "predict"
                ? "text-white"
                : "text-[#7b7a9d] hover:text-white"
              }`}
          >
            Predict
            {page === "predict" && (
              <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-gradient-to-r from-[#8B2FC9] to-[#C044F0] shadow-[0_0_10px_#c044f0]" />
            )}
          </button>
        </div>

        {/* API STATUS */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all
              ${apiOnline
                ? "bg-[#c044f0] shadow-[0_0_12px_#c044f0]"
                : "bg-[#444]"
              }`}
          />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#a0a0c0]">
            API
          </span>
        </div>

      </div>
    </nav>
  );
}