import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
// import Navbar from "../components/NavBar";
import { dashboard, insights, frequencyData } from "../api/api";
import { Outlet } from "react-router";

function DashboardLayout() {
  
  return (
    <div className="app ">
      <div className="">
        <Sidebar  />
      </div>
      <div className="md:hidden sticky top-0 z-20">
        {/* <Navbar /> */}
      </div>
      <div className="main-content ">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;

export const DashBoard = () => {
  // Initialize activeItem from localStorage or default to "home"
  const [activeItem, setActiveItem] = useState(() => {
    return localStorage.getItem("lastActiveItem") || "home";
  });
  const [metrics, setMetrics] = useState({
    totalVendors: 0,
    totalCustomers: 0,
    vendorChangePercent: 0,
    customerChangePercent: 0,
  });
  const [insightData, setInsightData] = useState(null);
  const [frequencyDataState, setFrequencyDataState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [metricsResponse, insightsResponse, frequencyResponse]: any =
        await Promise.all([
          dashboard(),
          insights({ month: "current_month" }),
          frequencyData(),
        ]);
   

      setMetrics({
        totalVendors: metricsResponse.data.totalVendors,
        totalCustomers: metricsResponse.data.totalCustomers,
        vendorChangePercent: metricsResponse.data.vendorChangePercent,
        customerChangePercent: metricsResponse.data.customerChangePercent,
      });
      setInsightData(insightsResponse);
      setFrequencyDataState(frequencyResponse);
    } catch (err) {
      console.error(err);
      // setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Persist activeItem to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lastActiveItem", activeItem);
  }, [activeItem]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="home-management bg-[#FFFFFF] md:p-10 shadow-2xl">
      <div className="header">
        <header className={"container"}>
          <h1 className={"title"} style={{ padding: "6px" }}>
            Insights & Analytics
          </h1>
          <p className={"subtitle"}>Key Metrics on Dashboard</p>
        </header>
      </div>

      <div className="stats-container">
        <StatCard
          title="Total Vendors Registered"
          value={metrics.totalVendors}
          change={`${metrics.vendorChangePercent.toFixed(2)}%`}
          isPositive={metrics.vendorChangePercent >= 0}
          color="blue"
        />
        <StatCard
          title="Total Customers Registered"
          value={metrics.totalCustomers}
          change={`${metrics.customerChangePercent.toFixed(2)}%`}
          isPositive={metrics.customerChangePercent >= 0}
          color="green"
        />
      </div>

      <LineChart title="Search Target Insights" insightData={insightData} />
      <BarChart
        title="Postcode Frequency Data"
        insightData={frequencyDataState}
      />
    </div>
  );
};
