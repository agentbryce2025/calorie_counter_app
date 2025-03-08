import React, { useState, useEffect } from 'react';
import './App.css';
import CalorieChart from './components/CalorieChart';
import FoodEntryForm from './components/FoodEntryForm';
import CalorieTable from './components/CalorieTable';
import CalendarView from './components/CalendarView';
import DailyDetail from './components/DailyDetail';
import DailyTimeline from './components/DailyTimeline';
import Navbar from './components/auth/Navbar';
import { format, isSameDay, addDays, isToday, subDays } from 'date-fns';
import { 
  getAllFoodEntries, 
  addFoodEntry, 
  deleteFoodEntry, 
  getEntriesForDate,
  getWeeklyCalorieData,
  getMonthlyCalorieData,
  FoodEntry 
} from './services/foodEntryService';
import {
  getDarkModePreference,
  saveDarkModePreference,
  getCalorieGoal,
  saveCalorieGoal
} from './services/userPreferences';

function App() {
  // User preferences
  const [darkMode, setDarkMode] = useState(getDarkModePreference());
  const [calorieGoal, setCalorieGoal] = useState(getCalorieGoal());
  
  // View states
  const [activeView, setActiveView] = useState("daily"); // "daily" or "analytics"
  const [analyticsTab, setAnalyticsTab] = useState("daily"); // "daily", "weekly", "monthly"
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Data states
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [calorieData, setCalorieData] = useState(getWeeklyCalorieData());
  const [monthlyData, setMonthlyData] = useState(getMonthlyCalorieData());
  
  // Load food entries on mount
  useEffect(() => {
    setFoodEntries(getAllFoodEntries());
  }, []);
  
  // Refresh the weekly data when entries change
  useEffect(() => {
    setCalorieData(getWeeklyCalorieData());
    setMonthlyData(getMonthlyCalorieData());
  }, [foodEntries]);
  
  // Filter food entries for the selected date
  const foodsForSelectedDate = foodEntries.filter(entry => 
    isSameDay(entry.date, selectedDate)
  );

  // Calculate total calories for the selected date
  const totalCaloriesForSelectedDate = foodsForSelectedDate.reduce(
    (sum, entry) => sum + entry.calories, 0
  );
  
  // Calculate remaining calories
  const remainingCalories = calorieGoal - totalCaloriesForSelectedDate;
  
  // Handle dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    saveDarkModePreference(newMode);
  };
  
  // Update calorie goal
  const updateCalorieGoal = (goal: number) => {
    setCalorieGoal(goal);
    saveCalorieGoal(goal);
  };
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };

  const handleAddFood = (foodName: string, calories: number) => {
    const entry = {
      name: foodName,
      calories: calories,
      date: selectedDate
    };
    
    // Add to database and get the new entry with ID
    const newEntry = addFoodEntry(entry);
    
    // Update local state
    setFoodEntries(prevEntries => [newEntry, ...prevEntries]);
  };

  const handleDeleteFood = (id: number) => {
    // Delete from database
    deleteFoodEntry(id);
    
    // Update local state
    setFoodEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto bg-opacity-95 min-h-screen pb-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => setActiveView(activeView === 'daily' ? 'analytics' : 'daily')}
              className={`px-3 py-1.5 rounded-md ${
                activeView === 'analytics' 
                  ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white') 
                  : (darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300')
              }`}
            >
              <span className="flex items-center">
                {activeView === 'daily' ? (
                  <>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Daily Log
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
        
        {/* Import the Navbar component at the top of the file */}
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <main className="px-6">
          {activeView === 'daily' ? (
            <>
              {/* Calendar View */}
              <CalendarView 
                darkMode={darkMode}
                selectedDate={selectedDate}
                onDateSelect={(date) => setSelectedDate(date)}
                calorieData={monthlyData}
              />
              
              {/* Date Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={goToPreviousDay}
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                  aria-label="Previous day"
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
                  aria-label="Next day"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Calorie Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Daily Goal: {calorieGoal} calories</span>
                  <button 
                    onClick={() => {
                      const newGoal = prompt("Enter your daily calorie goal:", calorieGoal.toString());
                      if (newGoal && !isNaN(parseInt(newGoal, 10))) {
                        updateCalorieGoal(parseInt(newGoal, 10));
                      }
                    }}
                    className={`text-xs px-2 py-0.5 rounded ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Edit Goal
                  </button>
                </div>
                <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      totalCaloriesForSelectedDate > calorieGoal ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((totalCaloriesForSelectedDate / calorieGoal) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    <span className="font-medium">{totalCaloriesForSelectedDate}</span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}> / {calorieGoal} calories</span>
                  </span>
                  <span className={`${
                    remainingCalories > 0 
                      ? (darkMode ? 'text-green-400' : 'text-green-600') 
                      : (darkMode ? 'text-red-400' : 'text-red-600')
                  }`}>
                    {remainingCalories > 0 ? `${remainingCalories} remaining` : `${Math.abs(remainingCalories)} over limit`}
                  </span>
                </div>
              </div>
              
              {/* Daily Detail */}
              <DailyDetail
                foods={foodsForSelectedDate.map(entry => ({
                  id: entry.id,
                  name: entry.name,
                  calories: entry.calories,
                  time: entry.date
                }))}
                totalCalories={totalCaloriesForSelectedDate}
                calorieGoal={calorieGoal}
                selectedDate={selectedDate}
                onDeleteFood={handleDeleteFood}
                darkMode={darkMode}
              />
              
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
                    ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white') 
                    : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')}`}
                  onClick={() => setAnalyticsTab('daily')}
                >
                  Daily
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${analyticsTab === 'weekly' 
                    ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white') 
                    : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')}`}
                  onClick={() => setAnalyticsTab('weekly')}
                >
                  Weekly
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${analyticsTab === 'monthly' 
                    ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white') 
                    : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')}`}
                  onClick={() => setAnalyticsTab('monthly')}
                >
                  Monthly
                </button>
              </div>

              <div className={`h-64 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border'}`}>
                <CalorieChart 
                  data={analyticsTab === 'monthly' ? monthlyData : calorieData} 
                  darkMode={darkMode} 
                  xAxisKey={analyticsTab === 'monthly' ? 'day' : 'day'}
                />
              </div>

              <CalorieTable 
                data={analyticsTab === 'monthly' ? monthlyData : calorieData} 
                darkMode={darkMode} 
                period={analyticsTab}
              />
              
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
