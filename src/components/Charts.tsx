import { Line } from 'react-chartjs-2';

interface ChartsProps {
  weight: (number | null)[];
  calorie: (number | null)[];
}
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Charts: React.FC<ChartsProps> = ({ weight, calorie }) => {
  const weightData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Weight (kg)',
        data: weight,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const calorieChartData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Calories (kcal)',
        data: calorie,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' as const },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg mx-4 mt-4 mb-20 p-4 overflow-visible"> {/* Increased padding-bottom */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Weekly Charts</h2>

      {/* Weight Check-In Chart */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">Weight Check-In</h3>
        <div className="flex justify-center">
          <div className="w-full max-w-lg h-64">
            <Line data={weightData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Calorie Intake Chart */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">Calorie Intake</h3>
        <div className="flex justify-center">
          <div className="w-full max-w-lg h-64">
            <Line data={calorieChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;