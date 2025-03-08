import React, { useState, useEffect } from 'react';
import { format, startOfToday } from 'date-fns';
import { CalorieChart } from './ui/chart';
import FoodEntryForm from './ui/food-entry-form';
import ProgressBar from './ui/progress-bar';
import CalendarView from './ui/calendar-view';
import DailyTimeline from './ui/daily-timeline';
import * as foodEntryService from '../services/foodEntryService';
import * as preferencesService from '../services/preferencesService';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [foodEntries, setFoodEntries] = useState<foodEntryService.FoodEntry[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ name: string; calories: number }[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [calorieGoal, setCalorieGoal] = useState<number>(preferencesService.getDailyCalorieGoal());
  
  // Load data for the selected date
  useEffect(() => {
    loadData();
  }, [selectedDate]);
  
  const loadData = () => {
    const entries = foodEntryService.getFoodEntriesByDate(selectedDate);
    const weekly = foodEntryService.getWeeklyCalorieData(selectedDate);
    const monthly = foodEntryService.getMonthlyCalorieData(selectedDate, calorieGoal);
    
    setFoodEntries(entries);
    setWeeklyData(weekly);
    setMonthlyData(monthly);
  };
  
  const handleAddFood = (entry: Omit<foodEntryService.FoodEntry, 'id'>) => {
    foodEntryService.addFoodEntry(entry);
    loadData();
  };
  
  const handleDeleteEntry = (id: string) => {
    foodEntryService.deleteFoodEntry(id);
    loadData();
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left column */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Daily Progress</span>
              <span className="text-gray-900 dark:text-gray-100">
                {totalCalories} / {calorieGoal} calories
              </span>
            </div>
            <ProgressBar 
              value={totalCalories} 
              max={calorieGoal} 
            />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Weekly Overview
          </h3>
          
          <CalorieChart data={weeklyData} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Today's Food Entries
          </h3>
          
          <DailyTimeline 
            entries={foodEntries}
            onDeleteEntry={handleDeleteEntry}
          />
        </div>
      </div>
      
      {/* Right column */}
      <div className="space-y-6">
        <FoodEntryForm onAddFood={handleAddFood} />
        
        <CalendarView 
          currentDate={selectedDate}
          foodEntries={monthlyData}
          onSelectDate={handleDateSelect}
        />
      </div>
    </div>
  );
};

export default Dashboard;