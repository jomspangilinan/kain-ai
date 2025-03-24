import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ChatBot from './pages/ChatBot';
import SummarizeMealsWithAI from './pages/SummarizeMeals';
import MaintainStreak from './pages/MaintainStreak';
import ShareJourney from './pages/ShareJourney';
import Header from './components/Header';
import ChatBotV2 from './pages/ChatBotV2';

export default function App() {
  return (
    <div>
      <NavBar />
      <Routes>
      <Route path="/" element={<Header />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/chatbotv2" element={<ChatBotV2 />} />
        <Route path="/summarize" element={<SummarizeMealsWithAI />} />
        <Route path="/streak" element={<MaintainStreak />} />
        <Route path="/share" element={<ShareJourney />} />
      </Routes>
    </div>
  );
}