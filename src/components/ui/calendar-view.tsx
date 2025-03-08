import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isWeekend, getDay } from 'date-fns';

interface CalendarViewProps {
  currentDate: Date;
  foodEntries: {
    date: string;
    totalCalories: number;
    goalCalories: number;
  }[];
  onSelectDate: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  currentDate, 
  foodEntries, 
  onSelectDate 
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate the day of week the month starts on (0 = Sunday, 6 = Saturday)
  const startDay = getDay(monthStart);
  
  // Create empty cells for the days before the start of the month
  const emptyDays = Array.from({ length: startDay }, (_, i) => (
    <div key={`empty-${i}`} className="h-12 bg-gray-50 dark:bg-gray-800/50"></div>
  ));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{format(currentDate, 'MMMM yyyy')}</h2>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div
            key={index}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {emptyDays}
        
        {days.map((day) => {
          // Find entries for this day
          const entry = foodEntries.find(
            (entry) => entry.date === format(day, 'yyyy-MM-dd')
          );
          
          // Determine the color based on calorie consumption
          let bgColorClass = 'bg-gray-100 dark:bg-gray-700/50';
          if (entry) {
            if (entry.totalCalories > entry.goalCalories) {
              bgColorClass = 'bg-red-100 dark:bg-red-900/30';
            } else if (entry.totalCalories >= entry.goalCalories * 0.8) {
              bgColorClass = 'bg-yellow-100 dark:bg-yellow-900/30';
            } else {
              bgColorClass = 'bg-green-100 dark:bg-green-900/30';
            }
          }
          
          return (
            <button
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              className={`
                h-12 flex items-center justify-center relative
                ${bgColorClass}
                ${isToday(day) ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                ${!isSameMonth(day, currentDate) ? 'text-gray-400 dark:text-gray-500' : ''}
                ${isWeekend(day) ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}
                hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md
              `}
            >
              <span className="text-sm">{format(day, 'd')}</span>
              
              {entry && (
                <span className="absolute bottom-1 left-0 right-0 text-xs">
                  {entry.totalCalories} cal
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;