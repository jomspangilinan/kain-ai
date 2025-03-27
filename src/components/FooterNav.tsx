import { FaHome, FaUtensils, FaBook, FaRobot, FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom'; // Import NavLink for routing

interface FooterNavigationProps {
  onChatbotToggle: () => void;
}

const FooterNavigation: React.FC<FooterNavigationProps> = ({ onChatbotToggle }) => {
  return (
    <footer className="bg-white shadow-md fixed bottom-0 left-0 right-0 flex justify-between items-center px-4 py-2 z-49">
      {/* Home Icon */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? 'text-green-600' : 'text-gray-500'} hover:text-green-600`
        }
      >
        <FaHome className="text-xl" />
        <span className="text-xs">Home</span>
      </NavLink>

      {/* Diary Icon */}
      <NavLink
        to="/diary"
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? 'text-green-600' : 'text-gray-500'} hover:text-green-600`
        }
      >
        <FaUtensils className="text-xl" />
        <span className="text-xs">Diary</span>
      </NavLink>

      {/* Chatbot Button */}
      <button
        onClick={onChatbotToggle}
        className="bg-green-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center -translate-y-6 hover:bg-green-700"
      >
        <FaRobot className="text-2xl" />
      </button>

      {/* Recipes Icon */}
      <NavLink
        to="/recipes"
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? 'text-green-600' : 'text-gray-500'} hover:text-green-600`
        }
      >
        <FaBook className="text-xl" />
        <span className="text-xs">Recipes</span>
      </NavLink>

      {/* More Icon */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center ${isActive ? 'text-green-600' : 'text-gray-500'} hover:text-green-600`
        }
      >
        <FaUser className="text-xl" />
        <span className="text-xs">Profile</span>
      </NavLink>
    </footer>
  );
};

export default FooterNavigation;