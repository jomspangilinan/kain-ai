import { useState } from 'react';
import { FaCoffee, FaUtensils, FaDrumstickBite } from 'react-icons/fa';

const mockData = {
  '2025-03-20': [
    { time: 'Breakfast', meal: 'Oatmeal with fruits', calories: 250 },
    { time: 'Lunch', meal: 'Grilled chicken salad', calories: 400 },
    { time: 'Dinner', meal: 'Salmon with steamed vegetables', calories: 500 },
  ],
  '2025-03-21': [
    { time: 'Breakfast', meal: 'Avocado toast', calories: 300 },
    { time: 'Lunch', meal: 'Turkey sandwich', calories: 450 },
    { time: 'Dinner', meal: 'Pasta with marinara sauce', calories: 600 },
  ],
};

export default function SummarizeMeals() {
  const [selectedDate, setSelectedDate] = useState<keyof typeof mockData>('2025-03-20');

  const totalCalories = mockData[selectedDate]?.reduce((sum, meal) => sum + meal.calories, 0) || 0;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h2 className="text-4xl font-bold text-blue-600 text-center mb-6">🌟 Summarize Meals</h2>
      <p className="text-gray-700 text-center mb-6">
        View your meal diary and calorie breakdown for each day.
      </p>

      {/* Total Calories */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 shadow-sm text-center">
        <p className="text-lg font-medium text-blue-600">
          Total Calories for {selectedDate}: <span className="font-bold">{totalCalories} kcal</span>
        </p>
      </div>

      {/* Date Selector */}
      <label className="block mb-6">
        <span className="text-gray-700 font-medium">Select Date:</span>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value as keyof typeof mockData)}
          className="block w-full mt-2 p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.keys(mockData).map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </label>

      {/* Meal Cards */}
      <div className="space-y-4">
        {mockData[selectedDate]?.length > 0 ? (
          mockData[selectedDate].map((meal, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center"
            >
              {/* Icon */}
              <div className="text-blue-600 text-2xl mr-4">
                {meal.time === 'Breakfast' && <FaCoffee />}
                {meal.time === 'Lunch' && <FaUtensils />}
                {meal.time === 'Dinner' && <FaDrumstickBite />}
              </div>
              {/* Meal Info */}
              <div className="flex-1">
                <p className="text-gray-700 font-medium">
                  <strong>{meal.time}:</strong> {meal.meal}
                </p>
                <p className="text-sm text-gray-500">Calories: {meal.calories} kcal</p>
              </div>
              {/* Calories Badge */}
              <div className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full shadow-sm">
                {meal.calories} kcal
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No meals logged for this date.</p>
        )}
      </div>
    </div>
  );
}