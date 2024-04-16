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
        },
      },
      y: {
        title: {
          text: "Count of word",
          display: false,
        },
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default Chart;
