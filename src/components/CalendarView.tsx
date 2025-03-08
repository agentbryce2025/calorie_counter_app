import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';

interface CalendarViewProps {
  darkMode: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  calorieData: {
    id: number;
    date: Date;
    calories: number;
    goal: number;
  }[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  darkMode,
  selectedDate,
  onDateSelect,
  calorieData
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const daysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const startDay = getDay(startOfMonth(currentMonth));
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = daysInMonth();
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  const getDayStatus = (day: Date) => {
    const entry = calorieData.find(data => 
      data.date.getDate() === day.getDate() && 
      data.date.getMonth() === day.getMonth() && 
      data.date.getFullYear() === day.getFullYear()
    );

    if (!entry) return { status: 'empty', calories: 0, goal: 0 };
    return {
      status: entry.calories > entry.goal ? 'exceeded' : 'within',
      calories: entry.calories,
      goal: entry.goal
    };
  };

  return (
    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white border'} mb-6`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            &lt;
          </button>
          <button 
            onClick={nextMonth}
            className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold p-2">{day}</div>
        ))}
        
        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="h-24 p-2"></div>
        ))}
        
        {days.map(day => {
          const dayStatus = getDayStatus(day);
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <div 
              key={day.toString()} 
              className={`h-24 p-2 rounded-md cursor-pointer transition-colors ${
                isSelected 
                  ? (darkMode ? 'bg-blue-800' : 'bg-blue-100') 
                  : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
              }`}
              onClick={() => onDateSelect(day)}
            >
              <div className="flex justify-between items-start">
                <span className={`${isSelected ? 'font-bold' : ''}`}>{format(day, 'd')}</span>
                {dayStatus.status !== 'empty' && (
                  <span className={`text-xs px-1 rounded-full ${
                    dayStatus.status === 'exceeded' 
                      ? 'bg-red-500 bg-opacity-20 text-red-500' 
                      : 'bg-green-500 bg-opacity-20 text-green-500'
                  }`}>
                    {dayStatus.status === 'exceeded' ? 'Over' : 'Good'}
                  </span>
                )}
              </div>
              {dayStatus.status !== 'empty' && (
                <div className="mt-1 text-xs">
                  <div>{dayStatus.calories} cal</div>
                  <div className="text-gray-500">Goal: {dayStatus.goal}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;