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
export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chatbot interface
  return (
    <div>
      {//<NavBar />
        <Routes>
          <Route path="/" element={<MobileIntegrated />} />
          <Route path="/profile" element={<PersonalInfoPage />} />
          <Route path="/diary" element={<SummarizeMealsWithAI />} />
          <Route path="/streak" element={<StreakPage />} />
          <Route path="/share" element={<SharePage />} />
        </Routes>}
      {/* Footer Navigation */}
      <FooterNavigation onChatbotToggle={() => setIsChatOpen(!isChatOpen)} />

      {/* Chatbot Component */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}