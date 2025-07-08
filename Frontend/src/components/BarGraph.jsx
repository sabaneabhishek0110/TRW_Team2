import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraph = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const unitsProduced = [260, 240, 190, 170, 220, 275, 160];

  // Generate color per bar based on unit thresholds
const getBarColor = (value) => {
  if (value > 250) return '#22c55e';   // ✅ green-500
  if (value >= 200) return '#eab308';  // ✅ yellow-500
  if (value >= 175) return '#f97316';  // ✅ orange-500
  return '#ef4444';                    // ✅ red-500
};

  const barColors = unitsProduced.map(getBarColor);

  const data = {
    labels: days,
    datasets: [
      {
        label: 'Units Produced',
        data: unitsProduced,
        backgroundColor: barColors,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Daily Production Report',
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Units: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 300,
        ticks: {
          stepSize: 50,
        },
        title: {
          display: true,
          text: 'Units',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Days',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarGraph;
