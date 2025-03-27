import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Swiper, SwiperSlide } from 'swiper/react';

interface GoalAndMacrosTrackerProps {
  caloriesConsumed: number;
  calorieGoal: number;
  macros: {
    carbs: { consumed: number; total: number };
    protein: { consumed: number; total: number };
    fat: { consumed: number; total: number };
  };
}

const GoalAndMacrosTracker: React.FC<GoalAndMacrosTrackerProps> = ({ caloriesConsumed, calorieGoal, macros }) => {
  const remainingCalories = calorieGoal - caloriesConsumed; // Ensure no negative values
  const progressPercentage = Math.min((caloriesConsumed / calorieGoal) * 100, 100); // For styling purposes

  return (
    <div className="mx-4 z-20 flex items-center space-x-4">
      <Swiper
        slidesPerView={1}
        centeredSlides={true}
        spaceBetween={20}
        className="mySwiper"
      >
        {/* Calories Card */}
        <SwiperSlide>
          <div className="bg-white shadow-md rounded-lg flex flex-col items-center space-y-4 p-4">
            <h2 className="text-lg font-semibold text-gray-700">Calories</h2>
            <div className="w-24 h-24">
              <CircularProgressbarWithChildren
                value={progressPercentage}
                styles={buildStyles({
                  textColor:
                    remainingCalories > 0
                      ? '#10B981' // green
                      : remainingCalories < 0
                        ? '#EF4444' // red
                        : '#6B7280', // gray for neutral (zero)
                  pathColor:
                    remainingCalories > 0
                      ? '#10B981'
                      : remainingCalories < 0
                        ? '#EF4444'
                        : '#9CA3AF', // gray path
                  trailColor: '#E5E7EB',
                })}
              >
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-700">{remainingCalories} kcal</p>
                  <p className="text-xs text-gray-500">
                    {remainingCalories > 0
                      ? 'remaining'
                      : remainingCalories < 0
                        ? 'over'
                        : ''}
                  </p>
                </div>
              </CircularProgressbarWithChildren>

            </div>
            <div className="text-center">
              <p className="text-gray-500">
                <span className="text-blue-500 font-bold">{caloriesConsumed}</span> / {calorieGoal} kcal
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* Macros Card */}
        <SwiperSlide>
          <div className="bg-white shadow-md rounded-lg flex flex-col items-center space-y-4 p-4">
            <h2 className="text-lg font-semibold text-gray-700">Macros</h2>
            <div className="space-y-2 w-full">
              {Object.entries(macros).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span>
                      {value.consumed} / {value.total}g
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${key === 'carbs'
                        ? 'bg-blue-500'
                        : key === 'protein'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                        }`}
                      style={{ width: `${Math.min((value.consumed / value.total) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default GoalAndMacrosTracker;