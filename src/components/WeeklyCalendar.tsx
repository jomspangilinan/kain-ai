import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons

interface WeeklyCalendarProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  themeColor?: 'blue' | 'orange' | 'red' | 'green'; // Restrict themeColor to specific keys
}

export default function WeeklyCalendar({ selectedDate, setSelectedDate, themeColor = 'blue' }: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date(selectedDate)); // Track the current week

  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 0 }); // Week starts on Sunday
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  const handlePreviousWeek = () => {
    const previousWeek = addDays(currentWeek, -7);
    setCurrentWeek(previousWeek);
    setSelectedDate(format(previousWeek, 'yyyy-MM-dd')); // Update selected date to the first day of the new week
  };

  const handleNextWeek = () => {
    const nextWeek = addDays(currentWeek, 7);
    setCurrentWeek(nextWeek);
    setSelectedDate(format(nextWeek, 'yyyy-MM-dd')); // Update selected date to the first day of the new week
  };

  const themeClasses = {
    blue: 'text-blue-500 bg-blue-500 border-blue-500',
    orange: 'text-orange-500 bg-orange-500 border-orange-500',
    red: 'text-red-500 bg-red-500 border-red-500',
    green: 'text-green-500 bg-green-500 border-green-500',
  };

  const selectedTheme = themeClasses[themeColor] || themeClasses.blue;

  return (
    <div className="text-center px-4">
      {/* Month and Year */}
      <p className={`text-lg font-bold ${selectedTheme.split(' ')[0]} mb-4`}>
        {format(startOfCurrentWeek, 'MMMM yyyy')}
      </p>

      {/* Week Navigation */}
      <div className="flex justify-between items-center mb-4">
        {/* Previous Button */}
        <button
          onClick={handlePreviousWeek}
          className={`w-10 h-10 flex items-center justify-center rounded-full ${
            themeColor === 'blue'
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : themeColor === 'orange'
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : themeColor === 'red'
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <FaChevronLeft className="text-lg" /> {/* Icon for Previous */}
        </button>

        {/* Days of the Week */}
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <div
              key={day.toISOString()}
              onClick={() => setSelectedDate(format(day, 'yyyy-MM-dd'))} // Update selected date
              className={`flex flex-col items-center justify-center w-12 h-12 cursor-pointer rounded-full transition-all duration-200 ${
                isSameDay(day, new Date(selectedDate))
                  ? `${selectedTheme} text-white font-bold`
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <p className="text-xs font-medium">{format(day, 'EEE')}</p> {/* Day abbreviation (e.g., Sun, Mon) */}
              <p className="text-sm font-semibold">{format(day, 'd')}</p> {/* Day number */}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextWeek}
          className={`w-10 h-10 flex items-center justify-center rounded-full ${
            themeColor === 'blue'
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : themeColor === 'orange'
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : themeColor === 'red'
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <FaChevronRight className="text-lg" /> {/* Icon for Next */}
        </button>
      </div>
    </div>
  );
}