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

/**
 * Bar chart component.
 *
 * @param {Map<Number, Number>} data
 * @param {string} label
 */
function Chart({ data, label }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
  );

  const chartData = {
    labels: [...data.keys().map((k) => k.toString())],
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
    layout: {
      padding: {
        right: 10,
        left: 10,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default Chart;
