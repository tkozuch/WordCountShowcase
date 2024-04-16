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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Chart() {
  const data = {
    labels: ["a", "b", "c", "d", " 5"],
    datasets: [
      {
        label: "Occurences of word x",
        data: [0, 2, 4, 0, 2],
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

  return <Bar data={data} options={options} />;
}

export default Chart;
