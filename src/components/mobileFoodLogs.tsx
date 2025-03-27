import React from 'react';

const mockData: Record<
    string,
    { meal: string; calories: number; protein: string; fat: string; carbohydrates: string; image: string }[]
> = {
    '2025-03-27': [
        {
            meal: 'Oatmeal with fruits',
            calories: 250,
            protein: '5g',
            fat: '3g',
            carbohydrates: '45g',
            image: 'https://nenaswellnesscorner.com/wp-content/uploads/2023/07/Oatmeal-with-fruit-n1.jpg', // Placeholder image
        },
        {
            meal: 'Grilled chicken salad',
            calories: 400,
            protein: '30g',
            fat: '10g',
            carbohydrates: '20g',
            image: 'https://www.wellseasonedstudio.com/wp-content/uploads/2023/04/Grilled-chicken-salad-with-cucumbers-and-creamy-garlic-dressing-on-a-plate.jpg', // Placeholder image
        },
        {
            meal: 'Salmon with steamed vegetables',
            calories: 500,
            protein: '40g',
            fat: '15g',
            carbohydrates: '25g',
            image: 'https://img.taste.com.au/xZCVddHQ/taste/2016/12/steamed-salmon-with-spring-vegetables-118993-2.jpg', // Placeholder image
        },
        {
            meal: 'Salmon with steamed vegetables',
            calories: 500,
            protein: '40g',
            fat: '15g',
            carbohydrates: '25g',
            image: 'https://img.taste.com.au/xZCVddHQ/taste/2016/12/steamed-salmon-with-spring-vegetables-118993-2.jpg', // Placeholder image
        },
        {
            meal: 'Salmon with steamed vegetables',
            calories: 500,
            protein: '40g',
            fat: '15g',
            carbohydrates: '25g',
            image: 'https://img.taste.com.au/xZCVddHQ/taste/2016/12/steamed-salmon-with-spring-vegetables-118993-2.jpg', // Placeholder image
        },
    ],
    '2025-03-28': [
        {
            meal: 'Avocado toast',
            calories: 300,
            protein: '6g',
            fat: '15g',
            carbohydrates: '30g',
            image: 'https://img.taste.com.au/xZCVddHQ/taste/2016/12/steamed-salmon-with-spring-vegetables-118993-2.jpg', // Placeholder image
        },
        {
            meal: 'Turkey sandwich',
            calories: 450,
            protein: '25g',
            fat: '10g',
            carbohydrates: '50g',
            image: 'https://www.wellseasonedstudio.com/wp-content/uploads/2023/04/Grilled-chicken-salad-with-cucumbers-and-creamy-garlic-dressing-on-a-plate.jpg', // Placeholder image
        },
        {
            meal: 'Pasta with marinara sauce',
            calories: 600,
            protein: '15g',
            fat: '10g',
            carbohydrates: '90g',
            image: 'https://nenaswellnesscorner.com/wp-content/uploads/2023/07/Oatmeal-with-fruit-n1.jpg', // Placeholder image
        },
    ],
};

interface FoodLogsProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: string; // Pass the selected date as a prop
}

const FoodLogs: React.FC<FoodLogsProps> = ({ isOpen, onClose, selectedDate }) => {
    const mealLog = mockData[selectedDate] || [];

    return (
        <div
            className={`mx-4 bg-white shadow-md rounded-lg fixed bottom-0 left-0 right-0 z-30 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
            style={{ height: '75%' }} // Set the height to 75% of the screen
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
                ✕
            </button>

            {/* Food Logs */}
            <div className="px-8 py-10 space-y-4 overflow-y-auto">
                {mealLog.length > 0 ? (
                    mealLog.map((meal, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-center gap-4">
                                {/* Placeholder Image */}
                                <img
                                    src={meal.image}
                                    alt={meal.meal}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-700 font-medium">{meal.meal}</p>
                                        <span className="bg-teal-100 text-teal-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                            {meal.calories} kcal
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p><strong>Protein:</strong> {meal.protein}</p>
                                        <p><strong>Fat:</strong> {meal.fat}</p>
                                        <p><strong>Carbohydrates:</strong> {meal.carbohydrates}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No food logs for this date.</p>
                )}
            </div>
        </div>
    );
};

export default FoodLogs;