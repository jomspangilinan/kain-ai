import { useState } from 'react';
import { FaCoffee, FaUtensils, FaDrumstickBite } from 'react-icons/fa';
import WeeklyCalendar from '../components/WeeklyCalendar';

const mockData: Record<
  string,
  { time: string; meal: string; calories: number; protein: string; fat: string; carbohydrates: string }[]
> = {
  '2025-03-20': [
    { time: 'Breakfast', meal: 'Oatmeal with fruits', calories: 250, protein: '5g', fat: '3g', carbohydrates: '45g' },
    { time: 'Lunch', meal: 'Grilled chicken salad', calories: 400, protein: '30g', fat: '10g', carbohydrates: '20g' },
    { time: 'Dinner', meal: 'Salmon with steamed vegetables', calories: 500, protein: '40g', fat: '15g', carbohydrates: '25g' },
  ],
  '2025-03-21': [
    { time: 'Breakfast', meal: 'Avocado toast', calories: 300, protein: '6g', fat: '15g', carbohydrates: '30g' },
    { time: 'Lunch', meal: 'Turkey sandwich', calories: 450, protein: '25g', fat: '10g', carbohydrates: '50g' },
    { time: 'Dinner', meal: 'Pasta with marinara sauce', calories: 600, protein: '15g', fat: '10g', carbohydrates: '90g' },
  ],
};

export default function SummarizeMealsWithAI() {
  const [selectedDate, setSelectedDate] = useState<string>('2025-03-20');
  const [mealLog, setMealLog] = useState<typeof mockData>(mockData);
  const [input, setInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null); // Track which meal is expanded

  const handleAddMeal = async () => {
    if (!input.trim()) return;

    setIsProcessing(true);

    try {
      // Simulate AI agent response
      const aiResponse = await mockAIResponse(input);

      // Add the parsed meal to the selected date
      setMealLog((prev) => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), aiResponse],
      }));

      setInput(''); // Clear the input box
    } catch (error) {
      console.error('Error parsing meal:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const mockAIResponse = async (mealDescription: string) => {
    // Simulate an AI response parsing the meal description
    return new Promise<{ time: string; meal: string; calories: number; protein: string; fat: string; carbohydrates: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          time: 'Lunch', // Default to "Lunch" for simplicity
          meal: mealDescription,
          calories: Math.floor(Math.random() * 500) + 200, // Random calorie value for demonstration
          protein: `${Math.floor(Math.random() * 30) + 10}g`, // Random protein value
          fat: `${Math.floor(Math.random() * 20) + 5}g`, // Random fat value
          carbohydrates: `${Math.floor(Math.random() * 50) + 20}g`, // Random carbohydrate value
        });
      }, 1000);
    });
  };
  const totalCalories = mealLog[selectedDate]?.reduce((sum, meal) => sum + meal.calories, 0) || 0;

  const toggleExpandMeal = (mealName: string) => {
    setExpandedMeal((prev) => (prev === mealName ? null : mealName)); // Toggle expand/collapse
  };

  const groupedMeals = mealLog[selectedDate]?.reduce((acc, meal) => {
    acc[meal.time] = acc[meal.time] || [];
    acc[meal.time].push(meal);
    return acc;
  }, {} as Record<string, typeof mealLog[string]>) || {};

  return (
    <div className="max-w-4xl mx-auto py-6">
       {/*<h2 className="text-4xl font-bold text-blue-600 text-center mb-6">🌟 Summarize Meals with AI</h2>
      <p className="text-gray-700 text-center mb-6">
        Log your meals and view a calorie breakdown for each day.
      </p>*/}
      {/* Total Calories */}
      <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6 shadow-sm text-center">
        <p className="text-lg font-medium text-blue-700">
          Total Calories for {selectedDate}: <span className="font-bold">{totalCalories} kcal</span>
        </p>
      </div>

      {/* Weekly Calendar */}
      <WeeklyCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {/* Grouped Meals */}
      {Object.entries(groupedMeals).map(([time, meals]) => (
        <div key={time} className="mb-6">
          {/* Section Header with Icons */}
          <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            {time === 'Breakfast' && <FaCoffee className="text-yellow-500" />}
            {time === 'Lunch' && <FaUtensils className="text-blue-500" />}
            {time === 'Dinner' && <FaDrumstickBite className="text-red-500" />}
            {time}
          </h3>
          <div className="space-y-4">
            {meals.map((meal, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-4"
                onClick={() => toggleExpandMeal(meal.meal)}
              >
                {/* Icon or Image */}
                <div className="flex-shrink-0">
                  {time === 'Breakfast' && <FaCoffee className="text-yellow-500 text-3xl" />}
                  {time === 'Lunch' && <FaUtensils className="text-blue-500 text-3xl" />}
                  {time === 'Dinner' && <FaDrumstickBite className="text-red-500 text-3xl" />}
                </div>
                {/* Meal Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">{meal.meal}</p>
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {meal.calories} kcal
                    </span>
                  </div>
                  {/* Expanded Macros */}
                  {expandedMeal === meal.meal && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p><strong>Protein:</strong> {meal.protein}</p>
                      <p><strong>Fat:</strong> {meal.fat}</p>
                      <p><strong>Carbohydrates:</strong> {meal.carbohydrates}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Input Section */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your meal (e.g., 'Grilled chicken with rice')"
          className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none mb-4"
          rows={3}
        />
        <button
          onClick={handleAddMeal}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Add Meal'}
        </button>
      </div>
      
    </div>
  );
}