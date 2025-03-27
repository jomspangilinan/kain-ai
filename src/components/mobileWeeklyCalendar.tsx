import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface WeeklyCalendarProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  setDaysOfWeek?: (days: string[]) => void;
  themeColor?: 'blue' | 'orange' | 'red' | 'green';
}

export default function WeeklyCalendar({
  selectedDate,
  setSelectedDate,
  themeColor = 'green',
  setDaysOfWeek,
}: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date(selectedDate));

  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  useEffect(() => {
    if (setDaysOfWeek) {
      setDaysOfWeek(daysOfWeek.map((day) => format(day, 'yyyy-MM-dd')));
    }
  }, [currentWeek, setDaysOfWeek]);

  const handlePreviousWeek = () => {
    const previousWeek = addDays(currentWeek, -7);
    setCurrentWeek(previousWeek);
    setSelectedDate(format(previousWeek, 'yyyy-MM-dd'));
  };

  const handleNextWeek = () => {
    const nextWeek = addDays(currentWeek, 7);
    setCurrentWeek(nextWeek);
    setSelectedDate(format(nextWeek, 'yyyy-MM-dd'));
  };

  const themeClasses = {
    blue: 'text-blue-500 bg-blue-500 border-blue-500',
    orange: 'text-orange-500 bg-orange-500 border-orange-500',
    red: 'text-red-500 bg-red-500 border-red-500',
    green: 'text-green-500 bg-green-500 border-green-500',
  };

  const selectedTheme = themeClasses[themeColor] || themeClasses.blue;

  return (
    <div
      className="bg-white shadow-md mx-4 rounded-lg text-center px-4 py-4 relative z-10 mb-4 mt-[-50px]">
      {/* Month and Year */}
      <p className={`text-lg font-bold ${selectedTheme.split(' ')[0]} mb-4`}>
        {format(startOfCurrentWeek, 'MMMM yyyy')}
      </p>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        {/* Previous Button */}
        <button
          onClick={handlePreviousWeek}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <FaChevronLeft className="text-lg text-gray-600" />
        </button>

        {/* Days of the Week */}
        <div className="flex overflow-x-auto gap-2">
          {daysOfWeek.map((day) => (
            <div
              key={day.toISOString()}
              onClick={() => setSelectedDate(format(day, 'yyyy-MM-dd'))}
              className={`relative flex flex-col items-center justify-center w-14 h-18 cursor-pointer rounded-full transition-all duration-200 ${isSameDay(day, new Date(selectedDate))
                ? `${selectedTheme} text-white font-bold`
                : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
              {/* Circle for Today */}
              {isToday(day) && (
                <div className="absolute bottom-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#FF8989' }} />
              )}
              <p className="text-xs font-medium">{format(day, 'EEE')}</p>
              <p className="text-sm font-semibold">{format(day, 'd')}</p>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextWeek}
          className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-opacity duration-200 ${daysOfWeek.some((day) => isToday(day)) ? 'invisible' : 'visible'
            }`}
        >
          <FaChevronRight className="text-lg text-gray-600" />
        </button>
      </div>
    </div>
  );
}