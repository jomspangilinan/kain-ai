import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useState } from 'react';

interface WeeklyCalendarProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export default function WeeklyCalendar({ selectedDate, setSelectedDate }: WeeklyCalendarProps) {
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

  return (
    <div>
      {/* Week Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePreviousWeek}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Previous Week
        </button>
        <p className="text-lg font-medium text-gray-700">
          {format(startOfCurrentWeek, 'MMM d')} - {format(addDays(startOfCurrentWeek, 6), 'MMM d')}
        </p>
        <button
          onClick={handleNextWeek}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Next Week
        </button>
      </div>

      {/* Weekly Calendar */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        {daysOfWeek.map((day) => (
          <div
            key={day.toISOString()}
            onClick={() => setSelectedDate(format(day, 'yyyy-MM-dd'))} // Update selected date
            className={`flex flex-col items-center justify-center w-16 h-20 cursor-pointer rounded-lg ${
              isSameDay(day, new Date(selectedDate))
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            <p className="text-sm">{format(day, 'EEE')}</p> {/* Day abbreviation (e.g., Sun, Mon) */}
            <p className="text-lg">{format(day, 'd')}</p> {/* Day number */}
          </div>
        ))}
      </div>
    </div>
  );
}