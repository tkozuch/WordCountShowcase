import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";

function Chart({ data, label }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
    // zoomPlugin
  );

  const chartData = {
    labels: [...data.keys()],
    datasets: [
      {
        label: label,
        data: [...data.values()],
        backgroundColor: "#a3a3a3",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
    },
    scales: {
      x: {
        title: {
          text: "Post ID",
          display: false,
        },
        grid: {
          display: false,
          color: "#a3a3a350",
        },
        ticks: {
          color: "#a3a3a3",
        },
        border: {
          color: "#a3a3a350",
        },
      },
      y: {
        title: {
          text: "Count of word",
          display: false,
        },
        ticks: {
          precision: 0,
          color: "#a3a3a3",
        },
        grid: {
          color: "#a3a3a350",
        },
        border: {
          color: "#a3a3a350",
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default Chart;
