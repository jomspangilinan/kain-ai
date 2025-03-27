const MealList = () => {
  return (
    <div className="flex-1 overflow-y-auto mt-4 mx-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Meals</h2>
      <ul className="space-y-4">
        {/* Example Meal */}
        <li className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-700 font-medium">Grilled Chicken Salad</p>
            <p className="text-gray-500 text-sm">Lunch</p>
          </div>
          <p className="text-green-600 font-bold">400 kcal</p>
        </li>
        <li className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-700 font-medium">Oatmeal with Fruits</p>
            <p className="text-gray-500 text-sm">Breakfast</p>
          </div>
          <p className="text-green-600 font-bold">300 kcal</p>
        </li>
        <li className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-700 font-medium">Grilled Salmon</p>
            <p className="text-gray-500 text-sm">Dinner</p>
          </div>
          <p className="text-green-600 font-bold">500 kcal</p>
        </li>
      </ul>
    </div>
  );
};

export default MealList;