const DailySummary = () => {
  return (
    <div className="bg-white shadow-md rounded-lg mx-4 mt-[-40px] p-4 z-20 relative">
      <h2 className="text-lg font-semibold text-gray-700">Today's Summary</h2>
      <p className="text-gray-500 mt-2">
        Total Calories: <span className="text-green-600 font-bold">1200 kcal</span>
      </p>
    </div>
  );
};

export default DailySummary;