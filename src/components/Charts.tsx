import { Line } from 'react-chartjs-2';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Chart,
} from 'chart.js';
import { useRef, useEffect } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartsProps {
  weight: (number | null)[];
  calorie: (number | null)[];
  selectedDate: string | null; // Format: '2025-03-25'
}

const Charts: React.FC<ChartsProps> = ({ weight, calorie, selectedDate }) => {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const selectedDayIndex = selectedDate ? new Date(selectedDate).getDay() : null;

  const weightChartRef = useRef<Chart<'line'>>(null);
  const calorieChartRef = useRef<Chart<'line'>>(null);

  useEffect(() => {
    if (selectedDayIndex !== null) {
      if (weightChartRef.current) {
        const chart = weightChartRef.current;
        chart.options.plugins.customSelectedIndex = selectedDayIndex;
        chart.setActiveElements([{ datasetIndex: 0, index: selectedDayIndex }]);
        chart.tooltip?.setActiveElements([{ datasetIndex: 0, index: selectedDayIndex }], { x: 0, y: 0 });
        chart.update();
      }

      if (calorieChartRef.current) {
        const chart = calorieChartRef.current;
        chart.options.plugins.customSelectedIndex = selectedDayIndex;
        chart.setActiveElements([{ datasetIndex: 0, index: selectedDayIndex }]);
        chart.tooltip?.setActiveElements([{ datasetIndex: 0, index: selectedDayIndex }], { x: 0, y: 0 });
        chart.update();
      }
    }
  }, [selectedDayIndex]);

  const getChartOptions = (): ChartOptions<'line'> => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      customSelectedIndex: null,
    },
    elements: {
      point: {
        radius: (ctx) => {
          const selectedIndex = ctx.chart.options.plugins?.customSelectedIndex;
          return selectedIndex === ctx.dataIndex ? 8 : 4;
        },
        backgroundColor: (ctx) => {
          const selectedIndex = ctx.chart.options.plugins?.customSelectedIndex;
          return selectedIndex === ctx.dataIndex ? 'rgba(100, 116, 139, 1)' : undefined; // slate-600
        },
      },
    },
  });

  const weightData = {
    labels,
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
    labels,
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

  const cardClass = `bg-white shadow-md rounded-lg mx-4 mt-4 mb-20 p-4 transition-transform duration-300 ${selectedDayIndex !== null ? 'scale-105 shadow-lg' : ''
    }`;

  return (
    <div className="overflow-visible">
      <Swiper slidesPerView={1} spaceBetween={20} modules={[Pagination, Navigation]} className="mySwiper">
        <SwiperSlide>
          <div className={cardClass}>
            <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">Weight Check-In</h3>
            <div className="flex justify-center">
              <div className="w-full max-w-lg h-64">
                <Line ref={weightChartRef} data={weightData} options={getChartOptions()} />
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className={cardClass}>
            <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">Calorie Intake</h3>
            <div className="flex justify-center">
              <div className="w-full max-w-lg h-64">
                <Line ref={calorieChartRef} data={calorieChartData} options={getChartOptions()} />
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Charts;
