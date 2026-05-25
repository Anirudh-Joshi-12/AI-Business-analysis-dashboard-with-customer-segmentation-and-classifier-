import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import StatCard from "../components/StatCard";
import DonutChart from "../components/DonutChart";
import RevenueChart from "../components/RevenueChart";
import ScatterPlot from "../components/ScatterChart";
import RFMHeatmap from "../components/RFMHeatmap";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar apiOnline={true} />

      <main className="max-w-[1400px] mx-auto px-10 py-8 space-y-8">

        {/* CARDS */}
        <div className="grid grid-cols-4 gap-6">
          {data.summary.map((item, i) => (
            <StatCard key={i} title={item.Segment} value={item.Customers} />
          ))}
        </div>

        {/* CHART ROW */}
        <div className="grid grid-cols-2 gap-6">
          <DonutChart data={data.distribution} />
          <RevenueChart data={data.revenue} />
        </div>

        {/* SCATTER */}
        <ScatterPlot data={data.scatter} />

        <RFMHeatmap data={data.heatmap} />

      </main>
    </div>
  );
}