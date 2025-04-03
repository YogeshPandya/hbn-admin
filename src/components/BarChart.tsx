import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { frequencyData } from "../api/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  title: string;
  insightData: any; // Initial frequencyData passed from Dashboard
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  insightData: initialData,
}) => {
  const [selectedFilter, setSelectedFilter] = useState("current_month");
  const [chartData, setChartData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFrequencyData = async () => {
      if (selectedFilter === "current_month" && initialData) {
        setChartData(initialData);
        return;
      }

      try {
        setLoading(true);
        const response = await frequencyData({ month: selectedFilter });
        setChartData(response);
      } catch (error) {
        console.error("Error fetching frequency data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFrequencyData();
  }, [selectedFilter, initialData]);

  const getChartData = () => {
    if (
      !chartData ||
      !chartData.data ||
      !chartData.data.data ||
      !Array.isArray(chartData.data.data)
    ) {
      console.log("Using fallback data - No valid frequency data available");
      return {
        labels: ["No Data"],
        datasets: [
          {
            label: "Registered Vendors",
            data: [0],
            backgroundColor: "#6c5ce7",
            barThickness: 20,
          },
          {
            label: "Registered Customers",
            data: [0],
            backgroundColor: "#d3d3d3",
            barThickness: 20,
          },
        ],
      };
    }

    const frequencyData = chartData.data.data;

    // Log all pincodes and city names explicitly
    frequencyData.forEach((item, index) => {
      const city =
        item.cities && item.cities.length > 0 ? item.cities[0] : "Unknown";
      const postcode = item.post_code || "Unknown";
    });

    // Generate numbered labels for the chart (e.g., "1. 3550 bendigo")
    const labels = frequencyData.map((item, index) => {
      const city =
        item.cities && item.cities.length > 0 ? item.cities[0] : "Unknown";
      const postcode = item.post_code || "Unknown";
      return `${index + 1}. ${postcode} ${city}`;
    });

    const vendorsData = frequencyData.map(
      (item) => item.registeredVendors || 0
    );
    const customersData = frequencyData.map(
      (item) => item.registeredCustomers || 0
    );


    return {
      labels,
      datasets: [
        {
          label: "Registered Vendors",
          data: vendorsData,
          backgroundColor: "#6c5ce7",
          barThickness: 20,
          categoryPercentage: 0.6,
          barPercentage: 0.8,
        },
        {
          label: "Registered Customers",
          data: customersData,
          backgroundColor: "#d3d3d3",
          barThickness: 20,
          categoryPercentage: 0.6,
          barPercentage: 0.8,
        },
      ],
    };
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "rect",
          padding: 10,
          font: { size: 12 },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#fff",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "#ddd",
        borderWidth: 1,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (context) => {
            const datasetLabel = context.dataset.label || "";
            const value = context.parsed.y;
            return `${datasetLabel}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)", // Slightly darker grid lines for visibility
          drawBorder: true,
        },
        title: {
          display: true,
          text: "Registered Users",
          font: { size: 14 },
          color: "#666",
        },
        ticks: {
          stepSize: 10, // Smaller step size for more granular numbering
          color: "#666",
          font: { size: 12 },
          callback: (value) => `${value}`, // Ensure numbers are shown clearly
        },
        max:
          Math.max(
            ...[
              ...getChartData().datasets[0].data,
              ...getChartData().datasets[1].data,
            ]
          ) + 10,
      },
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: "Postcode - City",
          font: { size: 14 },
          color: "#666",
        },
        ticks: {
          autoSkip: true, // Show all labels
          maxRotation: 0, // No rotation
          minRotation: 0, // No rotation
          color: "#666",
          font: { size: 8 }, // Reduced font size to minimize overlap
        },
      },
    },
  };

  return (
    <div className="chart-container sm:max-w-lg md:max-w-5xl shadow-2xl">
      <div className="chart-header">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="chart-controls">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="border rounded p-1 text-sm"
          disabled={loading}
        >
          <option value="current_month">Current Month</option>
          <option value="last_month">Last Month</option>
        </select>
      </div>
      <div className="chart-body">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Bar options={options} data={getChartData()} height={200} />
        )}
      </div>
    </div>
  );
};

export default BarChart;
