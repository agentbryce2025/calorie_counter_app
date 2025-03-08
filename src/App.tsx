import React, { useState } from 'react';
import './App.css';
import CalorieChart from './components/CalorieChart';
import FoodEntryForm from './components/FoodEntryForm';
import CalorieTable from './components/CalorieTable';
import CalendarView from './components/CalendarView';
import DailyDetail from './components/DailyDetail';
import DailyTimeline from './components/DailyTimeline';
import { format, isSameDay, addDays, isToday, subDays } from 'date-fns';

// Dummy data for calorie tracking by day of week
const initialChartData = [
  { id: 1, day: "Monday", calories: 2100, goal: 2000 },
  { id: 2, day: "Tuesday", calories: 1900, goal: 2000 },
  { id: 3, day: "Wednesday", calories: 2200, goal: 2000 },
  { id: 4, day: "Thursday", calories: 1850, goal: 2000 },
  { id: 5, day: "Friday", calories: 2050, goal: 2000 },
  { id: 6, day: "Saturday", calories: 2300, goal: 2000 },
  { id: 7, day: "Sunday", calories: 1950, goal: 2000 },
];

// Dummy data for calendar view
const generateCalendarData = () => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    
    // Create some variation in the data
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseCalories = isWeekend ? 2200 : 1900;
    const variation = Math.floor(Math.random() * 500) - 200; // -200 to +300
    
    return {
      id: day,
      date: date,
      calories: baseCalories + variation,
      goal: 2000
    };
  });
};

interface FoodEntry {
  id: number;
  name: string;
  calories: number;
  date: Date;
}

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [calorieData, setCalorieData] = useState(initialChartData);
  const [calendarData, setCalendarData] = useState(generateCalendarData());
  const [activeView, setActiveView] = useState("daily"); // "daily" or "analytics"
  const [analyticsTab, setAnalyticsTab] = useState("daily"); // "daily", "weekly", "monthly"
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filter food entries for the selected date
  const foodsForSelectedDate = foodEntries.filter(entry => 
    isSameDay(entry.date, selectedDate)
  );

  // Calculate total calories for the selected date
  const totalCaloriesForSelectedDate = foodsForSelectedDate.reduce(
    (sum, entry) => sum + entry.calories, 0
  );

  // Get calorie goal for the selected date
  const selectedDateCalorieGoal = 2000; // Default goal
  
  // Calculate remaining calories
  const remainingCalories = selectedDateCalorieGoal - totalCaloriesForSelectedDate;
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };

  const handleAddFood = (foodName: string, calories: number) => {
    const newEntry: FoodEntry = {
      id: Date.now(),
      name: foodName,
      calories: calories,
      date: selectedDate // Use the currently selected date
    };
    
    setFoodEntries([newEntry, ...foodEntries]);
    
    // Update the calendar data for the selected date
    setCalendarData(prevData => 
      prevData.map(item => {
        if (isSameDay(item.date, selectedDate)) {
          return {
            ...item,
            calories: item.calories + calories
          };
        }
        return item;
      })
    );
    
    // Also update the chart data if it's today
    const dayOfWeek = format(selectedDate, 'EEEE');
    setCalorieData(prevData => 
      prevData.map(item => {
        if (item.day === dayOfWeek) {
          return {
            ...item,
            calories: item.calories + calories
          };
        }
        return item;
      })
    );
  };

  const handleDeleteFood = (id: number) => {
    const entryToDelete = foodEntries.find(entry => entry.id === id);
    if (!entryToDelete) return;

    // Remove the entry
    setFoodEntries(foodEntries.filter(entry => entry.id !== id));
    
    // Update the calendar data to subtract the calories
    setCalendarData(prevData => 
      prevData.map(item => {
        if (isSameDay(item.date, entryToDelete.date)) {
          return {
            ...item,
            calories: item.calories - entryToDelete.calories
          };
        }
        return item;
      })
    );
    
    // Also update the chart data if needed
    const dayOfWeek = format(entryToDelete.date, 'EEEE');
    setCalorieData(prevData => 
      prevData.map(item => {
        if (item.day === dayOfWeek) {
          return {
            ...item,
            calories: item.calories - entryToDelete.calories
          };
        }
        return item;
      })
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto bg-opacity-95 min-h-screen pb-10">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Calorie Tracker</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setActiveView('analytics')}
              className={`px-3 py-1.5 rounded-md ${
                activeView === 'analytics' 
                  ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white') 
                  : (darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300')
              }`}
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </span>
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <main className="px-6">
          {activeView === 'daily' ? (
            <>
              {/* Date Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={goToPreviousDay}
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="text-center">
                  <h2 className="text-xl font-bold">{format(selectedDate, 'EEEE, MMMM d')}</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isToday(selectedDate) ? 'Today' : format(selectedDate, 'yyyy')}
                  </p>
                </div>
                
                <button 
                  onClick={goToNextDay}
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Calorie Progress Bar */}
              <div className="mb-8">
                <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${Math.min((totalCaloriesForSelectedDate / selectedDateCalorieGoal) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    <span className="font-medium">{totalCaloriesForSelectedDate}</span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}> / {selectedDateCalorieGoal} calories</span>
                  </span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {remainingCalories > 0 ? `${remainingCalories} remaining` : `${Math.abs(remainingCalories)} over limit`}
                  </span>
                </div>
              </div>
              
              {/* Daily Timeline */}
              <DailyTimeline 
                entries={foodsForSelectedDate.map(entry => ({
                  id: entry.id,
                  name: entry.name,
                  calories: entry.calories,
                  time: entry.date
                }))}
                onDeleteEntry={handleDeleteFood}
                darkMode={darkMode}
              />
              
              {/* Add Food Form */}
              <div className="mt-6">
                <FoodEntryForm darkMode={darkMode} onAddFood={handleAddFood} />
              </div>
            </>
          ) : (
            // Analytics View
            <div>
              <div className="flex space-x-4 mb-4">
                <button
                  className={`px-4 py-2 rounded-md ${analyticsTab === 'daily' 
                    ? (darkMode ? 'bg-indigo-600' : 'bg-indigo-500 text-white') 
                    : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}
                  onClick={() => setAnalyticsTab('daily')}
                >
                  Daily
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${analyticsTab === 'weekly' 
                    ? (darkMode ? 'bg-indigo-600' : 'bg-indigo-500 text-white') 
                    : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}
                  onClick={() => setAnalyticsTab('weekly')}
                >
                  Weekly
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${analyticsTab === 'monthly' 
                    ? (darkMode ? 'bg-indigo-600' : 'bg-indigo-500 text-white') 
                    : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}
                  onClick={() => setAnalyticsTab('monthly')}
                >
                  Monthly
                </button>
              </div>

              <div className={`h-64 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border'}`}>
                <CalorieChart data={calorieData} darkMode={darkMode} />
              </div>

              <CalorieTable data={calorieData} darkMode={darkMode} />
              
              <div className="flex justify-between mt-6 mb-3">
                <h2 className="text-xl font-bold">Complete Food Log</h2>
                <button 
                  onClick={() => setActiveView('daily')}
                  className={`px-3 py-1.5 rounded-md ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Back to Tracker
                </button>
              </div>
              
              {foodEntries.length > 0 ? (
                <div className={`overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <table className="min-w-full">
                    <thead>
                      <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                        <th className="py-2 px-4 text-left">Food</th>
                        <th className="py-2 px-4 text-left">Calories</th>
                        <th className="py-2 px-4 text-left">Date</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodEntries.map(entry => (
                        <tr key={entry.id} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                          <td className="py-2 px-4">{entry.name}</td>
                          <td className="py-2 px-4">{entry.calories}</td>
                          <td className="py-2 px-4">{format(entry.date, 'MMM d, yyyy h:mm a')}</td>
                          <td className="py-2 px-4">
                            <button 
                              onClick={() => handleDeleteFood(entry.id)}
                              className={`px-2 py-1 rounded-md text-sm ${
                                darkMode ? 'bg-red-900 hover:bg-red-800 text-red-100' : 'bg-red-100 hover:bg-red-200 text-red-600'
                              }`}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={`p-4 text-center rounded-lg ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                  No food entries yet. Add your first meal on the tracker page!
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
