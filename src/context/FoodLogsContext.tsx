import React, { createContext, useCallback, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

interface Meal {
    id: string;
    meal: string;
    calories: string;
    protein: string;
    fat: string;
    carbohydrates: string;
    image: string;
    ingredientsBreakdown?: Record<
        string,
        { calories: string; protein: string; fat: string; carbohydrates: string }
    >;
    serving: string;
}

interface FoodLogsContextProps {
    mealLog: Meal[];
    loading: boolean;
    fetchFoodLogs: (date: string) => Promise<void>;
    totalProximate: {
        calories: number;
        protein: number;
        fat: number;
        carbohydrates: number;
    };
    deleteFoodLog: (id: string) => Promise<void>;
}

const FoodLogsContext = createContext<FoodLogsContextProps | undefined>(undefined);

export const FoodLogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { activeAccount } = useAuth();
    const [mealLog, setMealLog] = useState<Meal[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalProximate, setTotalProximate] = useState({
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
    });

    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const deleteFoodLog = async (id: string) => {
        if (deleteLoading) return;
        setDeleteLoading(true);
        try {
            if (!activeAccount) return;
            const userId = activeAccount.homeAccountId;
            const response = await fetch(`/api/deletelog?userId=${userId}&foodId=${id}`);

            if (!response.ok) {
                throw new Error("Failed to delete food log");
            }
            console.log('pressed', response);
        } catch (error) {
            console.error("Error deleting food log:", error);
        } finally {
            setDeleteLoading(false);
        }
    };
    const fetchFoodLogs = useCallback(async (date: string) => {
        if (loading) return;
        setLoading(true);
        try {
            if (!activeAccount) return;
            const userId = activeAccount.homeAccountId;
            console.log(userId, `/api/foodlogs?userId=${userId}&date=${date}`);
            const response = await fetch(`/api/foodlogs?userId=${userId}&date=${date}`);
            console.log(response)
            if (!response.ok) {
                throw new Error("Failed to fetch food logs");
            }

            const data = await response.json();

            // Transform & strip any double units in the data
            const transformedData = data.map((log: any) => {
                const perServing = log.botResponse.total;
                return {
                    id: log.id,
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

            // Calculate total proximate values
            const totals = transformedData.reduce(
                (acc: { calories: number; protein: number; fat: number; carbohydrates: number; }, meal: { calories: string; protein: string; fat: string; carbohydrates: string; }) => {
                    acc.calories += parseFloat(meal.calories) || 0;
                    acc.protein += parseFloat(meal.protein) || 0;
                    acc.fat += parseFloat(meal.fat) || 0;
                    acc.carbohydrates += parseFloat(meal.carbohydrates) || 0;
                    return acc;
                },
                { calories: 0, protein: 0, fat: 0, carbohydrates: 0 }
            );
            setTotalProximate(totals);
        } catch (error) {
            console.error("Error fetching food logs:", error);
        } finally {
            setLoading(false);
        }
    }, [activeAccount, deleteLoading]);

    return (
        <FoodLogsContext.Provider value={{ mealLog, loading, fetchFoodLogs, totalProximate, deleteFoodLog }}>
            {children}
        </FoodLogsContext.Provider>
    );
};

export const useFoodLogs = (): FoodLogsContextProps => {
    const context = useContext(FoodLogsContext);
    if (!context) {
        throw new Error("useFoodLogs must be used within a FoodLogsProvider");
    }
    return context;
};