

import { useState } from 'react';
import WeeklyCalendar from '../components/mobileWeeklyCalendar';
import GoalTracker from '../components/GoalTracker';
import MacroProgress from '../components/MacroProgress';
import Charts from '../components/Charts';
import { mockData } from '../data/mockData';

import FooterNavigation from '../components/FooterNav';
import Chatbot from '../components/mobileChatbot';
import Header from '../components/mobileHeader';

export default function MobileIntegrated() {
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chatbot interface
  const [selectedDate, setSelectedDate] = useState('2025-03-26');
  const data = mockData[selectedDate as keyof typeof mockData] || mockData['2025-03-26'];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header/>
      <GoalTracker caloriesConsumed={data.goal.caloriesConsumed} calorieGoal={data.goal.calorieGoal} />
      <WeeklyCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      
      <MacroProgress macros={data.macros} />
      <Charts weight={data.weight} calorieData={{ labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [] }} />
     {/* Footer Navigation */}
     <FooterNavigation onChatbotToggle={() => setIsChatOpen(!isChatOpen)} />

{/* Chatbot Component */}
<Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}