import React, { useRef, useEffect } from 'react';
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
  ChartData,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartsProps {
  weight: (number | null)[];
  calorie: (number | null)[];
  selectedDate: string; // Format: '2025-03-25'
}

const Charts: React.FC<ChartsProps> = ({ weight, calorie, selectedDate }) => {
  // Labels for each day of the week:
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get the day index (0-6) from the selected date
  const selectedDayIndex = selectedDate ? new Date(selectedDate).getDay() : null;

  // Refs to the underlying Chart.js instances
  const weightChartRef = useRef<ChartJS<'line'>>(null);
  const calorieChartRef = useRef<ChartJS<'line'>>(null);

  // Highlight the selected day in each chart
  useEffect(() => {
    if (selectedDayIndex !== null) {
      // Highlight the correct index in the weight chart
      if (
        weightChartRef.current &&
        selectedDayIndex >= 0 &&
        selectedDayIndex < weight.length
      ) {
        const chart = weightChartRef.current;
        chart.setActiveElements([
          { datasetIndex: 0, index: selectedDayIndex },
        ]);
        chart.tooltip?.setActiveElements(
          [{ datasetIndex: 0, index: selectedDayIndex }],
          { x: 0, y: 0 }
        );
        chart.update();
      }

      // Highlight the correct index in the calorie chart
      if (
        calorieChartRef.current &&
        selectedDayIndex >= 0 &&
        selectedDayIndex < calorie.length
      ) {
        const chart = calorieChartRef.current;
        chart.setActiveElements([
          { datasetIndex: 0, index: selectedDayIndex },
        ]);
        chart.tooltip?.setActiveElements(
          [{ datasetIndex: 0, index: selectedDayIndex }],
          { x: 0, y: 0 }
        );
        chart.update();
      }
    }
  }, [selectedDayIndex, weight, calorie]);

  // Create chart options with dynamic point styling for the selected day
  const getChartOptions = (selectedIndex: number | null): ChartOptions<'line'> => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        filter: (tooltipItem) => {
          // Only show a tooltip if the data is not zero (and not null/undefined).
          const yValue = tooltipItem.parsed.y;
          return yValue !== 0 && yValue != null;
        },
      },
    },
    elements: {
      point: {
        radius: (ctx) => {
          if (selectedIndex !== null && ctx.dataIndex === selectedIndex) {
            return 8; // Bigger radius for the currently selected day
          }
          return 4;
        },
        backgroundColor: (ctx) => {
          if (selectedIndex !== null && ctx.dataIndex === selectedIndex) {
            return 'rgba(100, 116, 139, 1)'; // e.g. slate-600
          }
          return undefined;
        },
      },
    },
  });

  // Datasets for the weight chart
  const weightData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: weight,
        borderColor: '#89AC46',
        backgroundColor: '#EFEFEF',
        tension: 0.4,
      },
    ],
  };

  // Datasets for the calorie chart
  const calorieData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Calories (kcal)',
        data: calorie,
        borderColor: '#10B981',
        backgroundColor: '#EFEFEF',
        tension: 0.4,
      },
    ],
  };

  // Card styling for each Swiper slide
  const cardClass = `bg-white shadow-md rounded-lg mx-4 mt-4 mb-20 p-4 transition-transform duration-300`;

  return (
    <div className="overflow-visible">
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {/* Weight Chart */}
        <SwiperSlide>
          <div className={cardClass}>
            <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">
              Weight Check-In
            </h3>
            <div className="flex justify-center">
              <div className="w-full max-w-lg h-64">
                <Line
                  ref={weightChartRef}
                  data={weightData}
                  options={getChartOptions(selectedDayIndex)}
                />
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Calorie Chart */}
        <SwiperSlide>
          <div className={cardClass}>
            <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">
              Calorie Intake
            </h3>
            <div className="flex justify-center">
              <div className="w-full max-w-lg h-64">
                <Line
                  ref={calorieChartRef}
                  data={calorieData}
                  options={getChartOptions(selectedDayIndex)}
                />
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Charts;
