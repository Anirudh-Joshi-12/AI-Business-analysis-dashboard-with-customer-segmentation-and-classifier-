import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import DonutChart from "../components/DonutChart";
import RevenueChart from "../components/RevenueChart";
import ScatterPlot from "../components/ScatterChart";
import RFMHeatmap from "../components/RFMHeatmap";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch dashboard");
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const totalCustomers = data?.summary?.reduce((acc, s) => acc + s.Customers, 0) || 0;

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(192,68,240,0.04), transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(109,40,217,0.03), transparent 70%)" }}
        />
      </div>

      {/* Navbar */}
      <Navbar apiOnline={!error} />

      {/* Main */}
      <main className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-8 space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between mb-2 animate-fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Customer Segmentation Dashboard</h1>
            <p className="text-sm text-[#7b7a9d]">
              {loading
                ? "Loading analytics..."
                : `${totalCustomers.toLocaleString()} total customers across ${data?.summary?.length || 0} segments`
              }
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2a1a4a]/50 bg-[#11111f]/50 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-[#c044f0] shadow-[0_0_8px_#c044f0]" />
            <span className="text-xs text-[#a0a0c0] uppercase tracking-[0.15em] font-medium">Live Data</span>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#2a1a4a] border-t-[#c044f0] animate-spin" />
            <p className="text-sm text-[#7b7a9d]">Loading dashboard...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="h-[50vh] flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl border border-red-500/30 bg-red-500/5 flex items-center justify-center">
              <span className="text-2xl text-red-400">!</span>
            </div>
            <p className="text-lg font-semibold text-white">Failed to load dashboard</p>
            <p className="text-sm text-[#7b7a9d]">Make sure the backend is running on port 8000</p>
          </div>
        )}

        {/* Content */}
        {data && !loading && !error && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in">
              {data.summary.map((item, i) => (
                <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <StatCard title={item.Segment} value={item.Customers} />
                </div>
              ))}
            </div>

            {/* Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <DonutChart data={data.distribution} />
              <RevenueChart data={data.revenue} />
            </div>

            {/* Scatter + Heatmap */}
            <div className="grid grid-cols-1 gap-5">
              <ScatterPlot data={data.scatter} />
              <RFMHeatmap data={data.heatmap} />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-6 border-t border-[#2a1a4a]/30 mt-4">
        <div className="flex items-center justify-between text-[10px] text-[#555570] uppercase tracking-[0.2em]">
          <span>IKIII AI &mdash; Customer Segmentation</span>
          <span>Powered by RFM & K-Means</span>
        </div>
      </footer>

    </div>
  );
}
