import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ChartOptions,
} from "chart.js";
import api from "../api/api";

// Assuming this is your API function (imported or defined elsewhere)
const insights = async (params = { month: "current_month" }) => {
  try {
    const response = await api.get("/api/admin/dashboard/insight", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching insights:", error);
    throw error;
  }
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

interface LineChartProps {
  title: string;
  insightData: any; // Initial insightData passed from parent (optional)
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  insightData: initialData,
}) => {
  const [selectedFilter, setSelectedFilter] = useState("current_month");
  const [chartData, setChartData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  // Fetch data when the selected filter changes
  useEffect(() => {
    const fetchInsightsData = async () => {
      if (selectedFilter === "current_month" && initialData) {
        setChartData(initialData);
        return;
      }

      try {
        setLoading(true);
        const response = await insights({ month: selectedFilter });
        setChartData(response);
      } catch (error) {
        console.error("Error fetching insights data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsightsData();
  }, [selectedFilter, initialData]);

  const getChartData = () => {
    if (
      !chartData ||
      !chartData.data ||
      !chartData.data.data ||
      !Array.isArray(chartData.data.data)
    ) {
      console.log("Invalid chartData, using fallback data");
      return {
        labels: ["No Data"],
        datasets: [
          {
            label: "Today",
            data: [0],
            borderColor: "#6c5ce7",
            backgroundColor: "rgba(108, 92, 231, 0.1)",
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: "Yesterday",
            data: [0],
            borderColor: "#a29bfe",
            backgroundColor: "rgba(162, 155, 254, 0.1)",
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      };
    }

    const citiesData = chartData.data.data;
    // const citiesData = [
    //   {
    //     searchCountMonth: 5,
    //     city: "bendigo",
    //     searchCountToday: 10,
    //     searchCountYesterday: 8,
    //   },
    //   {
    //     searchCountMonth: 5,
    //     city: "Annandale",
    //     searchCountToday: 12,
    //     searchCountYesterday: 7,
    //   },
    //   {
    //     searchCountMonth: 4,
    //     city: "BRISBANE",
    //     searchCountToday: 15,
    //     searchCountYesterday: 10,
    //   },
    //   {
    //     searchCountMonth: 3,
    //     city: "Aeroglen",
    //     searchCountToday: 5,
    //     searchCountYesterday: 3,
    //   },
    //   {
    //     searchCountMonth: 2,
    //     city: "Buch am Irchel",
    //     searchCountToday: 8,
    //     searchCountYesterday: 6,
    //   },
    //   {
    //     searchCountMonth: 1,
    //     city: "Kuridala",
    //     searchCountToday: 2,
    //     searchCountYesterday: 1,
    //   },
    // ];

    const labels = citiesData.map((item: any) => item.city || "Unknown");
    const todayData = citiesData.map((item: any) => item.searchCountToday || 0);
    const yesterdayData = citiesData.map(
      (item: any) => item.searchCountYesterday || 0
    );



    return {
      labels,
      datasets: [
        {
          label: "Today",
          data: todayData,
          borderColor: "#6c5ce7",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#6c5ce7",
          pointBorderWidth: 2,
          fill: false,
        },
        {
          label: "Yesterday",
          data: yesterdayData,
          borderColor: "#a29bfe",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#a29bfe",
          pointBorderWidth: 2,
          fill: false,
        },
      ],
    };
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Remove the legend
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "#fff",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
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
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          stepSize: 10,
        },
        title: {
          display: true,
          text: "Number of Searches",
          color: "#666",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          padding: 10,
        },
        suggestedMax: 50,
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
        },
      },
    },
  };

  const chartDataResult = getChartData();
  const hasData = chartDataResult.labels.length > 0;


  return (
    <div className="chart-container max-w-5xl  p-6 bg-white rounded-lg shadow-2xl mb-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-4">
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="radio"
              name="viewMode"
              value="current_month"
              checked={selectedFilter === "current_month"}
              onChange={() => setSelectedFilter("current_month")}
              className="mr-2 accent-purple-600"
              disabled={loading}
            />
            This Month
          </label>
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="radio"
              name="viewMode"
              value="last_month"
              checked={selectedFilter === "last_month"}
              onChange={() => setSelectedFilter("last_month")}
              className="mr-2 accent-purple-600"
              disabled={loading}
            />
            Last Month
          </label>
        </div>
      </div>
      <div className="relative h-[250px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 ">
            Loading...
          </div>
        ) : hasData ? (
          <Line options={options} data={chartDataResult} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            No data available to display.
          </div>
        )}
      </div>
    </div>
  );
};

export default LineChart;
