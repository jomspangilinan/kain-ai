import { FaFire } from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';

const StreakPage = () => {
    const streakDays = 15; // Example streak count
    const loggedDays = ['2025-03-10', '2025-03-11', '2025-03-12', '2025-03-13']; // Example logged days
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-md mx-auto py-6 px-4 relative">
            {/* Close Button */}
            <NavLink to="/">
                <div className="absolute top-8 right-6 text-white hover:text-green-700">
                    <AiFillCloseCircle size={24} />
                </div>
            </NavLink>
            {/* Streak Counter */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6 shadow-md text-center">
                <FaFire className="text-4xl mx-auto mb-2" />
                <h2 className="text-2xl font-bold">Your Streak</h2>
                <p className="text-lg mt-2">
                    <span className="font-bold">{streakDays}</span> days of consistent logging!
                </p>
            </div>

            {/* Calendar View */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Logged Days</h3>
                <div className="grid grid-cols-7 gap-2 text-center">
                    {Array.from({ length: 30 }).map((_, index) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (29 - index));
                        const dateString = date.toISOString().split('T')[0];
                        const isLogged = loggedDays.includes(dateString);
                        const isToday = dateString === today;

                        return (
                            <div
                                key={index}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${isLogged
                                    ? 'bg-green-500 text-white'
                                    : isToday
                                        ? 'border-2 border-green-500 text-green-500'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {date.getDate()}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Motivational Message */}
            <div className="mt-6 bg-blue-100 border border-blue-300 rounded-lg p-4 text-center">
                <p className="text-blue-700 font-medium">
                    Keep it up! You're building a healthy habit. 🌟
                </p>
            </div>
        </div>
    );
};

export default StreakPage;