import React, { useState, useEffect } from 'react';
import { format, startOfToday, subDays } from 'date-fns';
import { CalorieChart } from './ui/chart';
import FoodEntryForm from './ui/food-entry-form';
import ProgressBar from './ui/progress-bar';
import CalendarView from './ui/calendar-view';
import DailyTimeline from './ui/daily-timeline';
import ApiStats from './ApiStats';
import ErrorMessage from './ui/ErrorMessage';
import NutritionChart from './NutritionChart';
import TrendsChart from './TrendsChart';
import ExportModal from './ExportModal';
import SocialSharing from './SocialSharing';
import { DownloadIcon, Share1Icon } from '@radix-ui/react-icons';
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
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [weeklyEntries, setWeeklyEntries] = useState<any[]>([]);
  
  // Fetch weekly and monthly data
  useEffect(() => {
    const weekly = foodEntryService.getWeeklyCalorieData(selectedDate);
    const monthly = foodEntryService.getMonthlyCalorieData(selectedDate, calorieGoal);
    
    setWeeklyData(weekly);
    setMonthlyData(monthly);
    
    // Get the food entries for the past week for sharing
    const fetchWeeklyEntries = async () => {
      try {
        // Get entries for the past 7 days 
        const entries = [];
        for (let i = 0; i < 7; i++) {
          const date = subDays(selectedDate, i);
          const dailyEntries = await foodEntryService.getFoodEntriesByDate(date);
          entries.push(...dailyEntries);
        }
        setWeeklyEntries(entries);
      } catch (error) {
        console.error("Error fetching weekly entries:", error);
      }
    };
    
    fetchWeeklyEntries();
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
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading data...</span>
        </div>
      )}

      {/* Left column */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold tracking-tight">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            <button
              onClick={() => setExportModalOpen(true)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <DownloadIcon className="mr-2 h-4 w-4" /> Export Data
            </button>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-muted-foreground font-medium">Daily Progress</span>
              <span className="font-semibold">
                {totalCalories} / {calorieGoal} calories
              </span>
            </div>
            <ProgressBar 
              value={totalCalories} 
              max={calorieGoal} 
              className="h-3"
            />
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold tracking-tight">
              Weekly Overview
            </h3>
            <div className="flex gap-2">
              <SocialSharing
                foodEntries={weeklyEntries}
                period="week"
                hashtags={["caloriecounter", "nutrition", "health"]}
                showLabel={false}
                className="inline-flex"
              />
            </div>
          </div>
          
          <div className="rounded-md border bg-card p-1">
            <CalorieChart data={weeklyData} />
          </div>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h3 className="text-xl font-semibold tracking-tight mb-4">
            Today's Food Entries
          </h3>
          
          <DailyTimeline 
            entries={foodEntries}
            onDeleteEntry={handleDeleteEntry}
          />

          {foodEntries.length === 0 && (
            <div className="py-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M8 12h8" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-1">No food entries yet</h3>
              <p className="text-muted-foreground">Add your first meal to start tracking</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Right column */}
      <div className="space-y-6">
        <div className="bg-card rounded-lg border shadow-sm">
          <FoodEntryForm onAddFood={handleAddFood} />
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold tracking-tight mb-4">Calendar</h3>
          <CalendarView 
            currentDate={selectedDate}
            foodEntries={monthlyData}
            onSelectDate={handleDateSelect}
          />
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold tracking-tight mb-4">API Status</h3>
          <ApiStats darkMode={false} />
        </div>
      </div>

      {/* Enhanced Analytics Section - Full width */}
      <div className="col-span-full">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            Nutritional Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Macronutrient Breakdown
              </h3>
              <div className="rounded-md border bg-card p-4 h-64">
                <NutritionChart 
                  foodEntries={foodEntries} 
                  darkMode={false} 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Nutrient Trends (14 Days)
              </h3>
              <div className="rounded-md border bg-card p-4 h-64">
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
      
      {/* Export Modal */}
      <ExportModal open={exportModalOpen} onOpenChange={setExportModalOpen} />
    </div>
  );
};

export default Dashboard;