import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// Utility to ensure we don't end up with double "kcal" or "g" in the UI
// For example, if the API returns "120 kcal" we remove " kcal", leaving only "120" for display.
function stripUnits(value: string) {
    return value.replace(/\s?(kcal|g)/gi, "").trim();
}

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
                    const per100g = log.botResponse.per100grams;
                    return {
                        meal: log.botResponse.dish,
                        calories: stripUnits(per100g.calories),
                        protein: stripUnits(per100g.protein),
                        fat: stripUnits(per100g.fat),
                        carbohydrates: stripUnits(per100g.carbohydrates),
                        image: `https://kaliaistorage.blob.core.windows.net/img/${log.imageUrl}?${import.meta.env.VITE_AZURE_SAS_TOKEN
                            }`,
                        ingredientsBreakdown: log.botResponse.ingredientsBreakdown
                            ? Object.fromEntries(
                                Object.entries(log.botResponse.ingredientsBreakdown).map(
                                    ([ingredient, details]: [string, any]) => [
                                        ingredient,
                                        {
                                            calories: stripUnits(details.calories),
                                            protein: stripUnits(details.protein),
                                            fat: stripUnits(details.fat),
                                            carbohydrates: stripUnits(details.carbohydrates),
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
            className={`mx-4 bg-white shadow-md rounded-t-lg fixed bottom-0 left-0 right-0 z-30 flex flex-col transform transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-full"
                }`}
            style={{ height: "75%" }} // Adjust as needed
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
                ✕
            </button>

            {/* Food Logs Container */}
            <div className="px-4 py-6 space-y-4 overflow-y-auto">
                {loading ? (
                    <p className="text-gray-500 text-center">Loading food logs...</p>
                ) : mealLog.length > 0 ? (
                    mealLog.map((meal, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                            {/* Meal Header */}
                            <div className="flex gap-4">
                                <img
                                    src={meal.image}
                                    alt={meal.meal}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-800 font-medium">{meal.meal}</p>
                                        {/* Calories Badge (per 100g) */}
                                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                                            <span role="img" aria-label="Calories">
                                                🔥
                                            </span>
                                            {meal.calories} kcal / 100g
                                        </span>
                                    </div>

                                    {/* Macro Badges in a grid */}
                                    <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-2 w-full">
                                        {/* Protein */}
                                        <span className="inline-flex items-center justify-center gap-1 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full">
                                            <span role="img" aria-label="Protein">
                                                🍗
                                            </span>
                                            {meal.protein} g
                                        </span>
                                        {/* Fat */}
                                        <span className="inline-flex items-center justify-center gap-1 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-600 rounded-full">
                                            <span role="img" aria-label="Fat">
                                                🧈
                                            </span>
                                            {meal.fat} g
                                        </span>
                                        {/* Carbs */}
                                        <span className="inline-flex items-center justify-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full">
                                            <span role="img" aria-label="Carbs">
                                                🍞
                                            </span>
                                            {meal.carbohydrates} g
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
                                <div className="mt-4 text-sm text-gray-700 border-t pt-4">
                                    <p className="font-medium mb-3">Ingredients Breakdown (per 100g)</p>
                                    <div className="space-y-3">
                                        {Object.entries(meal.ingredientsBreakdown).map(
                                            ([ingredient, details]) => (
                                                // Use grid to equally space the name + macros
                                                <div
                                                    key={ingredient}
                                                    className="grid grid-cols-5 items-center gap-2 p-3 bg-gray-50 rounded-md"
                                                >
                                                    {/* Ingredient Name */}
                                                    <span className="font-semibold col-span-2 text-gray-800">
                                                        {ingredient}
                                                    </span>
                                                    {/* Calories */}
                                                    <span className="inline-flex items-center justify-center gap-1 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                                                        <span role="img" aria-label="Calories">
                                                            🔥
                                                        </span>
                                                        {details.calories} kcal
                                                    </span>
                                                    {/* Protein */}
                                                    <span className="inline-flex items-center justify-center gap-1 bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                                                        <span role="img" aria-label="Protein">
                                                            🍗
                                                        </span>
                                                        {details.protein} g
                                                    </span>
                                                    {/* Fat */}
                                                    <span className="inline-flex items-center justify-center gap-1 bg-yellow-100 text-yellow-600 text-xs font-semibold px-2 py-1 rounded-full">
                                                        <span role="img" aria-label="Fat">
                                                            🧈
                                                        </span>
                                                        {details.fat} g
                                                    </span>
                                                    {/* Carbs */}
                                                    <span className="inline-flex items-center justify-center gap-1 bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
                                                        <span role="img" aria-label="Carbs">
                                                            🍞
                                                        </span>
                                                        {details.carbohydrates} g
                                                    </span>
                                                </div>
                                            )
                                        )}
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
