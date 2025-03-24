import { useState } from 'react';
import { FaMedal, FaBook, FaTrophy } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function MaintainStreak() {
  const [progress, setProgress] = useState(50); // Mock progress percentage
  const [streakDays, setStreakDays] = useState(5); // Mock streak days
  const [reward, setReward] = useState<string | null>(null); // Reward to display in the popup

  const handleAddProgress = () => {
    const newProgress = Math.min(progress + 10, 100);
    setProgress(newProgress);

    // Check for milestones and set the reward
    if (newProgress === 10) setReward('Virtual Badge 🏅');
    if (newProgress === 50) setReward('Free Nutrition Guide 📘');
    if (newProgress === 100) {
      setReward('Exclusive Recipe Book 📖');
      setStreakDays((prev) => prev + 1); // Increment streak days when progress reaches 100%
      setProgress(0); // Reset progress after reaching 100%
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h2 className="text-4xl font-bold text-blue-600 text-center mb-6">🔥 Maintain Streak</h2>
      <p className="text-gray-700 text-center mb-6">
        Keep your streak alive! Earn rewards for reaching milestones.
      </p>

      {/* Streak Counter */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 shadow-sm text-center">
        <p className="text-lg font-medium text-blue-600">
          You’ve maintained your streak for <span className="font-bold">{streakDays} days</span>!
        </p>
      </div>

      {/* Circular Progress Bar */}
      <div className="w-40 h-40 mx-auto mb-6">
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            textColor: '#2563eb', // Blue text
            pathColor: '#2563eb', // Blue progress path
            trailColor: '#d1d5db', // Gray trail
          })}
        />
      </div>

      {/* Add Progress Button */}
      <div className="text-center">
        <button
          onClick={handleAddProgress}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Log Today’s Progress
        </button>
      </div>

      {/* Rewards Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-blue-600 mb-4">🏆 Rewards</h3>
        <ul className="space-y-3">
          <li
            className={`p-4 border rounded-lg shadow-sm flex items-center ${
              progress >= 10 ? 'bg-green-50 border-green-300' : 'bg-gray-50'
            }`}
          >
            <FaMedal className={`text-2xl mr-4 ${progress >= 10 ? 'text-yellow-500' : 'text-gray-400'}`} />
            <div>
              <strong>10% Progress:</strong> Virtual Badge 🏅
            </div>
          </li>
          <li
            className={`p-4 border rounded-lg shadow-sm flex items-center ${
              progress >= 50 ? 'bg-green-50 border-green-300' : 'bg-gray-50'
            }`}
          >
            <FaBook className={`text-2xl mr-4 ${progress >= 50 ? 'text-blue-500' : 'text-gray-400'}`} />
            <div>
              <strong>50% Progress:</strong> Free Nutrition Guide 📘
            </div>
          </li>
          <li
            className={`p-4 border rounded-lg shadow-sm flex items-center ${
              progress === 0 && streakDays > 5 ? 'bg-green-50 border-green-300' : 'bg-gray-50'
            }`}
          >
            <FaTrophy className={`text-2xl mr-4 ${progress === 0 && streakDays > 5 ? 'text-green-500' : 'text-gray-400'}`} />
            <div>
              <strong>100% Progress:</strong> Exclusive Recipe Book 📖
            </div>
          </li>
        </ul>
      </div>

      {/* Reward Popup Modal */}
      {reward && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm text-center">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">🎉 Congratulations!</h3>
            <p className="text-gray-700 mb-4">
              You’ve unlocked: <span className="font-bold">{reward}</span>
            </p>
            <button
              onClick={() => setReward(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}