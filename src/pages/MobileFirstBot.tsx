

import { useState } from 'react';
import WeeklyCalendar from '../components/mobileWeeklyCalendar';
//import GoalTracker from '../components/GoalTracker';
//import MacroProgress from '../components/MacroProgress';
import Charts from '../components/Charts';
import { mockData } from '../data/mockData';

import FooterNavigation from '../components/FooterNav';
import Chatbot from '../components/mobileChatbot';
import Header from '../components/mobileHeader';
import GoalAndMacrosTracker from '../components/GoalTracker';

export default function MobileIntegrated() {
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chatbot interface
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);

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


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <WeeklyCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} setDaysOfWeek={setDaysOfWeek} />
      <GoalAndMacrosTracker
        caloriesConsumed={data.goal.caloriesConsumed}
        calorieGoal={data.goal.calorieGoal}
        macros={data.macros}
      />
      <Charts weight={getWeightsForDays(daysOfWeek)} calorie={getCaloriesForDays(daysOfWeek)} />
      {/* Footer Navigation */}
      <FooterNavigation onChatbotToggle={() => setIsChatOpen(!isChatOpen)} />

      {/* Chatbot Component */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}