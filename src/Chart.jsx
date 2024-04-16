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

function Chart({ data }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const chartData = {
    labels: [...data.keys()],
    datasets: [
      {
        label: "Occurences of word x",
        data: [...data.values()],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          text: "Post ID",
          display: true,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          text: "Count of word",
          display: true,
        },
        ticks: {
          precision: 0,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default Chart;
