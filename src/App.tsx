import { Routes, Route } from 'react-router-dom';
/*import NavBar from './components/NavBar';
import ChatBot from './pages/ChatBot';
import SummarizeMealsWithAI from './pages/SummarizeMeals';
import MaintainStreak from './pages/MaintainStreak';
import ShareJourney from './pages/ShareJourney';
import Header from './components/Header';
import ChatBotV2 from './pages/ChatBotV2';*/
import MobileIntegrated from './pages/MobileFirstBot';
import PersonalInfoPage from './pages/PersonalInfoPage';
import FooterNavigation from './components/FooterNav';
import Chatbot from './components/mobileChatbot';
import { useState } from 'react';
import SummarizeMealsWithAI from './pages/SummarizeMeals';
import StreakPage from './pages/StreakPage';
import SharePage from './pages/SharePage';
import FoodLogs from './components/mobileFoodLogs';
import WeeklyCalendar from './components/mobileWeeklyCalendar';
import Header from './components/mobileHeader';
export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chatbot interface
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  return (
    <div>
      <Header />
      <WeeklyCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} setDaysOfWeek={setDaysOfWeek} />

      {//<NavBar />
        <Routes>
          <Route path="/" element={<MobileIntegrated selectedDate={selectedDate} daysOfWeek={daysOfWeek} />} />
          <Route path="/profile" element={<PersonalInfoPage />} />
          <Route path="/diary" element={<SummarizeMealsWithAI />} />
          <Route path="/streak" element={<StreakPage />} />
          <Route path="/share" element={<SharePage />} />
        </Routes>}
      {/* Footer Navigation */}
      <FooterNavigation onChatbotToggle={() => setIsChatOpen(!isChatOpen)} onFoodLogsToggle={() => setIsDiaryOpen(!isDiaryOpen)} />

      {/* Chatbot Component */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* DiaryOpen Component */}
      <FoodLogs isOpen={isDiaryOpen} onClose={() => setIsDiaryOpen(false)} selectedDate={selectedDate} />
    </div>
  );
}