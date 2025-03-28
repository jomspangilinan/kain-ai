import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/mobileHeader";
import WeeklyCalendar from "./components/mobileWeeklyCalendar";
import MobileIntegrated from "./pages/MobileFirstBot";
//import PersonalInfoPage from "./pages/PersonalInfoPage";
import SummarizeMealsWithAI from "./pages/SummarizeMeals";
import StreakPage from "./pages/StreakPage";
import SharePage from "./pages/SharePage";
import FooterNavigation from "./components/FooterNav";
import Chatbot from "./components/mobileChatbot";
import FoodLogs from "./components/mobileFoodLogs";
import Login from "./pages/Login";
import { useState } from "react";
import GoalPage from "./pages/Multistep.tsx/0Goal";
import WeightPage from "./pages/Multistep.tsx/1Weight";


export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const location = useLocation();

  // Will be true if the current path starts with /streak
  const hideHeaderCalendar = location.pathname.startsWith("/streak") || location.pathname.startsWith("/share") || location.pathname.startsWith("/profile") || location.pathname.startsWith("/step");

  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const { activeAccount } = useAuth();

  return (
    <div>
      {!activeAccount ? (
        <Login />
      ) : (
        <>
          {!hideHeaderCalendar && <Header />}
          {!hideHeaderCalendar && <WeeklyCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setDaysOfWeek={setDaysOfWeek}
          />}
          <Routes>
            <Route
              path="/"
              element={
                <MobileIntegrated
                  selectedDate={selectedDate}
                  daysOfWeek={daysOfWeek}
                />
              }
            />
            <Route path="/profile" element={<GoalPage />} />
            <Route path="/diary" element={<SummarizeMealsWithAI />} />
            <Route path="/streak" element={<StreakPage />} />
            <Route path="/share" element={<SharePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/step1" element={<WeightPage />} />
          </Routes>
          <FooterNavigation
            onChatbotToggle={() => setIsChatOpen(!isChatOpen)}
            onFoodLogsToggle={() => setIsDiaryOpen(!isDiaryOpen)}
          />
          <Chatbot
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
          <FoodLogs
            isOpen={isDiaryOpen}
            onClose={() => setIsDiaryOpen(false)}
            selectedDate={selectedDate}
          />
        </>

      )}
    </div>
  );
}