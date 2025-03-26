import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface GoalTrackerProps {
  caloriesConsumed: number;
  calorieGoal: number;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ caloriesConsumed, calorieGoal }) => {
  const progressPercentage = Math.min((caloriesConsumed / calorieGoal) * 100, 100);

  return (
    <div className="bg-white shadow-md rounded-lg mx-4 mt-[-40px] p-4 z-20 flex items-center space-x-4">
      <div className="w-20 h-20">
        <CircularProgressbar
          value={progressPercentage}
          text={`${Math.round(progressPercentage)}%`}
          styles={buildStyles({
            textColor: '#4CAF50',
            pathColor: '#4CAF50',
            trailColor: '#E0E0E0',
          })}
        />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-700">Daily Goal</h2>
        <p className="text-gray-500">
          <span className="text-red-500 font-bold">{caloriesConsumed}</span> / {calorieGoal} kcal
        </p>
      </div>
    </div>
  );
};

export default GoalTracker;