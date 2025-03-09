import React, { useState, useEffect } from 'react';
import { format, startOfToday } from 'date-fns';
import { CalorieChart } from './ui/chart';
import FoodEntryForm from './ui/food-entry-form';
import ProgressBar from './ui/progress-bar';
import CalendarView from './ui/calendar-view';
import DailyTimeline from './ui/daily-timeline';
import ApiStats from './ApiStats';
import ErrorMessage from './ui/ErrorMessage';
import NutritionChart from './NutritionChart';
import TrendsChart from './TrendsChart';
import * as foodEntryService from '../services/foodEntryService';
import * as preferencesService from '../services/preferencesService';
import useFoodEntries from '../hooks/useFoodEntries';
import { useToast } from '../contexts/ToastContext';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const { showToast } = useToast();
  const { 
    entries: foodEntries, 
    addEntry, 
    deleteEntry, 
    loading, 
    error,
    fetchEntries 
  } = useFoodEntries(selectedDate);
  const [weeklyData, setWeeklyData] = useState<{ name: string; calories: number }[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [calorieGoal, setCalorieGoal] = useState<number>(preferencesService.getDailyCalorieGoal());
  
  // Fetch weekly and monthly data
  useEffect(() => {
    const weekly = foodEntryService.getWeeklyCalorieData(selectedDate);
    const monthly = foodEntryService.getMonthlyCalorieData(selectedDate, calorieGoal);
    
    setWeeklyData(weekly);
    setMonthlyData(monthly);
  }, [selectedDate, calorieGoal, foodEntries]);
  
  const handleAddFood = async (food: { name: string; calories: number; timestamp: string; mealType: string; carbs?: number; protein?: number; fat?: number }) => {
    try {
      await addEntry(food);
      showToast(`Added ${food.name} to your food entries`, 'success');
    } catch (err) {
      showToast(`Failed to add food entry: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    }
  };
  
  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteEntry(id);
      showToast('Food entry deleted successfully', 'success');
    } catch (err) {
      showToast(`Failed to delete entry: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    }
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Error message */}
      {error && (
        <div className="col-span-full">
          <ErrorMessage 
            error={typeof error === 'string' ? new Error(error) : new Error('Unknown error')} 
            onRetry={fetchEntries}
          />
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="col-span-full flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading data...</span>
        </div>
      )}

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
        
        <ApiStats darkMode={false} />
      </div>

      {/* Enhanced Analytics Section - Full width */}
      <div className="col-span-full mt-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">
            Nutritional Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Macronutrient Breakdown
              </h3>
              <div className="h-64">
                <NutritionChart 
                  foodEntries={foodEntries} 
                  darkMode={false} 
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Nutrient Trends (14 Days)
              </h3>
              <div className="h-64">
                <TrendsChart 
                  foodEntries={foodEntries} 
                  darkMode={false} 
                  days={14}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;