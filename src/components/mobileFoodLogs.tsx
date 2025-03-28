import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaUtensils } from "react-icons/fa";


interface Meal {
    meal: string;
    calories: string;       // e.g. "120" (or "120 kcal" before we clean it)
    protein: string;        // e.g. "9"   (or "9 g" before we clean it)
    fat: string;            // e.g. "5"
    carbohydrates: string;  // e.g. "10"
    image: string;
    ingredientsBreakdown?: Record<
        string,
        { calories: string; protein: string; fat: string; carbohydrates: string }
    >;
    serving: string;
}

interface FoodLogsProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: string;
}

const FoodLogs: React.FC<FoodLogsProps> = ({ isOpen, onClose, selectedDate }) => {
    const [mealLog, setMealLog] = useState<Meal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedMealIndex, setExpandedMealIndex] = useState<number | null>(null);
    const { activeAccount } = useAuth();

    useEffect(() => {
        const fetchFoodLogs = async () => {
            setLoading(true);
            try {
                if (!activeAccount) return;
                const userId = activeAccount.homeAccountId;
                const response = await fetch(
                    `/api/foodlogs?userId=${userId}&date=${selectedDate}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch food logs");
                }
                const data = await response.json();

                // Transform & strip any double units in the data
                const transformedData = data.map((log: any) => {
                    const perServing = log.botResponse.total;
                    return {
                        meal: log.botResponse.dish,
                        calories: perServing.calories,
                        protein: perServing.protein,
                        fat: perServing.fat,
                        carbohydrates: perServing.carbohydrates,
                        image: log.imageUrl
                            ? `https://kaliaistorage.blob.core.windows.net/img/${log.imageUrl}?${import.meta.env.VITE_AZURE_SAS_TOKEN}`
                            : null,
                        serving: perServing.serving,
                        ingredientsBreakdown: log.botResponse.ingredientsBreakdown
                            ? Object.fromEntries(
                                Object.entries(log.botResponse.ingredientsBreakdown).map(
                                    ([ingredient, details]: [string, any]) => [
                                        ingredient,
                                        {
                                            calories: details.calories,
                                            protein: details.protein,
                                            fat: details.fat,
                                            carbohydrates: details.carbohydrates,
                                        },
                                    ]
                                )
                            )
                            : undefined,
                    };
                });

                setMealLog(transformedData);
            } catch (error) {
                console.error("Error fetching food logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFoodLogs();
    }, [selectedDate]);

    const toggleExpand = (index: number) => {
        setExpandedMealIndex(expandedMealIndex === index ? null : index);
    };

    return (
        <div
            className={` h-screen overflow-y-auto bg-gray-100 mx-4 bg-white shadow-md rounded-t-lg fixed bottom-0 left-0 right-0 z-30 flex flex-col transform transition-transform duration-300 pb-20 ${isOpen ? "translate-y-0" : "translate-y-full"
                }`}
            style={{ height: "75%" }} // Adjust as needed
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-green-500 hover:text-gray-700"
            >
                <AiFillCloseCircle size={24} />
            </button>

            {/* Food Logs Container */}
            <div className="px-10 py-10 space-y-4">
                {loading ? (
                    <p className="text-gray-500 text-center">Loading food logs...</p>
                ) : mealLog.length > 0 ? (
                    mealLog.map((meal, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                            {/* Meal Header */}
                            <div className="flex gap-4 items-center">
                                {meal.image ? (
                                    <img
                                        src={meal.image}
                                        alt={meal.meal}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <FaUtensils className="text-gray-400 w-8 h-8" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-800 font-medium">{meal.meal}</p>
                                        {/* Calories Badge */}
                                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                                            🔥 {meal.calories} / {meal.serving}
                                        </span>
                                    </div>

                                    {/* Macro Badges */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full">
                                            🍗 Protein: {meal.protein}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-600 rounded-full">
                                            🧈 Fat: {meal.fat} g
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full">
                                            🍞 Carbs: {meal.carbohydrates}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Expandable Section */}
                            <button
                                onClick={() => toggleExpand(index)}
                                className="mt-4 text-sm text-teal-600 hover:underline"
                            >
                                {expandedMealIndex === index
                                    ? "Hide Ingredients"
                                    : "Show Ingredients"}
                            </button>

                            {/* Ingredient Breakdown */}
                            {expandedMealIndex === index && meal.ingredientsBreakdown && (
                                <div className="mt-4 text-gray-700 border-t pt-4">
                                    <p className="text-base font-semibold text-gray-800 block">Ingredients Breakdown</p>
                                    <div className="space-y-3">
                                        {Object.entries(meal.ingredientsBreakdown).map(([ingredient, details]) => (
                                            <div
                                                key={ingredient}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                                            >
                                                {/* Ingredient Name and Proximate Breakdown */}
                                                <div className="flex-1">
                                                    <span className="text-base font-semibold text-gray-800 block">
                                                        {ingredient}
                                                    </span>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full">
                                                            🍗 Protein: {details.protein}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-600 rounded-full">
                                                            🧈 Fat: {details.fat}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full">
                                                            🍞 Carbs: {details.carbohydrates}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Calories Badge */}
                                                <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 font-semibold px-3 py-2 rounded-full text-sm">
                                                    🔥 {details.calories}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
