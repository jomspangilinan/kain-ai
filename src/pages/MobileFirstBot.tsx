

//import { useState } from 'react';
//import WeeklyCalendar from '../components/mobileWeeklyCalendar';
import Charts from '../components/Charts';
import { mockData } from '../data/mockData';

//import FooterNavigation from '../components/FooterNav';
//import Chatbot from '../components/mobileChatbot';
//import Header from '../components/mobileHeader';
import GoalAndMacrosTracker from '../components/GoalTracker';
import { useFoodLogs } from '../context/FoodLogsContext';


interface MobileIntegratedProps {
  selectedDate: string;
  daysOfWeek: string[];
}


export default function MobileIntegrated({ selectedDate, daysOfWeek }: MobileIntegratedProps) {
  const { totalProximate } = useFoodLogs();
  const data = mockData[selectedDate as keyof typeof mockData] || mockData['2025-03-26'];

  const getWeightsForDays = (daysOfWeek: string[]) => {
    return daysOfWeek.map((day) => {
      const data = mockData[day as keyof typeof mockData];
      return data ? data.weight : null; // Return the weight if the day exists, otherwise return null
    });
  };

  const getCaloriesForDays = (daysOfWeek: string[]) => {
    return daysOfWeek.map((day) => {
      const data = mockData[day as keyof typeof mockData];
      return data ? data.goal.caloriesConsumed : null; // Return the weight if the day exists, otherwise return null
    });
  };

  const updatedMacros = {
    carbs: {
      consumed: totalProximate.carbohydrates,
      total: data.macros.carbs.total,
    },
    protein: {
      consumed: totalProximate.protein,
      total: data.macros.protein.total,
    },
    fat: {
      consumed: totalProximate.fat,
      total: data.macros.fat.total,
    },
  };
  return (
    <div className="bg-gray-100 flex flex-col">
      <GoalAndMacrosTracker
        caloriesConsumed={totalProximate.calories}
        calorieGoal={data.goal.calorieGoal}
        macros={updatedMacros}
      />
      <Charts weight={getWeightsForDays(daysOfWeek)} calorie={getCaloriesForDays(daysOfWeek)} selectedDate={selectedDate} />

    </div>
  );
}