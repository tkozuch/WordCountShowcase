import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";

/**
 * Line graph component.
 *
 * @param {Map<Number, Number>} data
 * @param {string} label
 */
function Graph({ data, label }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    Tooltip,
    PointElement,
    LineElement,
    zoomPlugin
  );

  const chartData = {
    labels: [...data.keys().map((k) => k.toString())],
    datasets: [
      {
        label: label,
        data: [...data.values()],
        backgroundColor: "#a3a3a3",
        borderColor: "#00000050",
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
        // make first element little more accessable
        left: 5,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default Graph;
