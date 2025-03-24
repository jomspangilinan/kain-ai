import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="bg-blue-600 text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
        <Link to="/" className="hover:underline">🍱 Calorie Buddy
        </Link></h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/chatbot" className="hover:underline">
              💬 Chatbot
            </Link>
          </li>
          <li>
            <Link to="/summarize" className="hover:underline">
              🌟 Summarize Meals
            </Link>
          </li>
          <li>
            <Link to="/streak" className="hover:underline">
              🔥 Maintain Streak
            </Link>
          </li>
          <li>
            <Link to="/share" className="hover:underline">
              🎥 Share Journey
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}