import { FaHome, FaUtensils, FaBook, FaRobot, FaUser } from 'react-icons/fa';

interface FooterNavigationProps {
  onChatbotToggle: () => void;
}

const FooterNavigation: React.FC<FooterNavigationProps> = ({ onChatbotToggle }) => {
  return (
    <footer className="bg-white shadow-md fixed bottom-0 left-0 right-0 flex justify-between items-center px-4 py-2">
      {/* Home Icon */}
      <button className="flex flex-col items-center text-gray-500 hover:text-green-600">
        <FaHome className="text-xl" />
        <span className="text-xs">Home</span>
      </button>

      {/* Diary Icon */}
      <button className="flex flex-col items-center text-gray-500 hover:text-green-600">
        <FaUtensils className="text-xl" />
        <span className="text-xs">Diary</span>
      </button>

      {/* Chatbot Button */}
      <button
        onClick={onChatbotToggle}
        className="bg-green-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center -translate-y-6 hover:bg-green-700"
      >
        <FaRobot className="text-2xl" />
      </button>

      {/* Recipes Icon */}
      <button className="flex flex-col items-center text-gray-500 hover:text-green-600">
        <FaBook className="text-xl" />
        <span className="text-xs">Recipes</span>
      </button>

      {/* More Icon */}
      <button className="flex flex-col items-center text-gray-500 hover:text-green-600">
        <FaUser className="text-xl" />
        <span className="text-xs">Profile</span>
      </button>
    </footer>
  );
};

export default FooterNavigation;