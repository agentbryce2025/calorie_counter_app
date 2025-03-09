import React, { useState, useEffect } from 'react';
import { format, startOfToday, subDays, parseISO } from 'date-fns';
import { BarChart, Utensils, Calendar, Download, TrendingUp, User, LogOut } from 'lucide-react';
import { CalorieChart } from './ui/chart';
import FoodEntryForm from './FoodEntryForm';
import ProgressBar from './ui/progress-bar';
import CalendarView from './ui/calendar-view';
import DailyTimeline from './ui/daily-timeline';
import ApiStats from './ApiStats';
import ErrorMessage from './ui/ErrorMessage';
import NutritionChart from './NutritionChart';
import TrendsChart from './TrendsChart';
import ExportModal from './ExportModal';
import SocialSharing from './SocialSharing';
import { ThemeToggle } from './ui/theme-toggle';
import * as foodEntryService from '../services/foodEntryService';
import * as preferencesService from '../services/preferencesService';
import useFoodEntries from '../hooks/useFoodEntries';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: string;
  mealType: string;
  carbs?: number;
  protein?: number;
  fat?: number;
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const { showToast } = useToast();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
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
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);

  // Group food entries by meal type
  const groupedEntries = foodEntries.reduce((groups, entry) => {
    const mealType = entry.mealType || 'other';
    if (!groups[mealType]) {
      groups[mealType] = [];
    }
    groups[mealType].push(entry);
    return groups;
  }, {} as Record<string, FoodEntry[]>);

  // Sort entries by timestamp
  Object.keys(groupedEntries).forEach(mealType => {
    groupedEntries[mealType].sort((a, b) => {
      const dateA = parseISO(a.timestamp);
      const dateB = parseISO(b.timestamp);
      return dateB.getTime() - dateA.getTime();
    });
  });
  
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-64 flex-col bg-gray-900">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Calorie Tracker</h1>
          <ThemeToggle />
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            <button
              className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                activeNav === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => setActiveNav('dashboard')}
            >
              <BarChart className="mr-3 h-5 w-5" />
              Dashboard
            </button>
            <button
              className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                activeNav === 'meals' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => setActiveNav('meals')}
            >
              <Utensils className="mr-3 h-5 w-5" />
              Meal Planner
            </button>
            <button
              className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                activeNav === 'calendar' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => setActiveNav('calendar')}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Calendar
            </button>
            <button
              className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                activeNav === 'analytics' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => setActiveNav('analytics')}
            >
              <TrendingUp className="mr-3 h-5 w-5" />
              Analytics
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <button
                onClick={handleLogout}
                className="flex items-center text-xs text-gray-400 hover:text-gray-200 mt-1"
              >
                <LogOut className="h-3 w-3 mr-1" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold">Calorie Tracker</h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md bg-gray-800"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <nav className="px-4 py-3 space-y-1 bg-gray-900 border-b border-gray-800">
            <button
              className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                activeNav === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => {
                setActiveNav('dashboard');
                setIsMobileMenuOpen(false);
              }}
            >
              <BarChart className="mr-3 h-5 w-5" />
              Dashboard
            </button>
            <button
              className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                activeNav === 'meals' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => {
                setActiveNav('meals');
                setIsMobileMenuOpen(false);
              }}
            >
              <Utensils className="mr-3 h-5 w-5" />
              Meal Planner
            </button>
            <button
              className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                activeNav === 'calendar' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => {
                setActiveNav('calendar');
                setIsMobileMenuOpen(false);
              }}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Calendar
            </button>
            <button
              className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                activeNav === 'analytics' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => {
                setActiveNav('analytics');
                setIsMobileMenuOpen(false);
              }}
            >
              <TrendingUp className="mr-3 h-5 w-5" />
              Analytics
            </button>
            <div className="pt-2 mt-2 border-t border-gray-800">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center px-3 py-2 text-sm rounded-md text-gray-400 hover:bg-gray-800 hover:text-white w-full"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Log out
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:overflow-hidden">
        <div className="flex-1 md:overflow-y-auto md:p-8 p-4 md:pt-8 pt-20 bg-black">
          {/* Error message */}
          {error && (
            <div className="mb-6">
              <ErrorMessage 
                error={typeof error === 'string' ? new Error(error) : new Error('Unknown error')} 
                onRetry={fetchEntries}
              />
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-400">Loading data...</span>
            </div>
          )}

          {!loading && (
            <div className="space-y-8">
              {/* Header section with date and controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setExportModalOpen(true)}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 bg-gray-800 text-white hover:bg-gray-700 h-10 px-4 py-2"
                  >
                    <Download className="mr-2 h-4 w-4" /> Export
                  </button>
                </div>
              </div>

              {/* Progress summary */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-400 font-medium">Daily Progress</span>
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
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">
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
                    
                    <div className="rounded-md border border-gray-800 bg-gray-800/50 p-3 h-64">
                      <CalorieChart data={weeklyData} />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-4">
                      Macronutrients
                    </h3>
                    <div className="rounded-md border border-gray-800 bg-gray-800/50 p-3 h-64">
                      <NutritionChart 
                        foodEntries={foodEntries} 
                        darkMode={true} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Food entries and add food */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                    <h3 className="text-xl font-semibold mb-6">
                      Today's Food Entries
                    </h3>
                    
                    {Object.keys(groupedEntries).length > 0 ? (
                      <div className="space-y-6">
                        {Object.entries(groupedEntries).map(([mealType, entries]) => (
                          <div key={mealType} className="space-y-2">
                            <h4 className="text-lg font-medium capitalize">{mealType}</h4>
                            <div className="space-y-2">
                              {entries.map(entry => (
                                <div 
                                  key={entry.id} 
                                  className="flex items-center justify-between p-3 rounded-md bg-gray-800/50 border border-gray-700"
                                >
                                  <div>
                                    <p className="font-medium">{entry.name}</p>
                                    <div className="text-xs text-gray-400 mt-1">
                                      {entry.carbs && <span className="mr-2">Carbs: {entry.carbs}g</span>}
                                      {entry.protein && <span className="mr-2">Protein: {entry.protein}g</span>}
                                      {entry.fat && <span>Fat: {entry.fat}g</span>}
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-semibold mr-4">{entry.calories} cal</span>
                                    <button 
                                      onClick={() => handleDeleteEntry(entry.id)}
                                      className="text-gray-400 hover:text-red-500 transition-colors"
                                      aria-label="Delete entry"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M8 12h8" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium mb-1">No food entries yet</h3>
                        <p className="text-gray-400">Add your first meal to start tracking</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-lg border border-gray-800">
                    <FoodEntryForm onAddFood={handleAddFood} darkMode={true} />
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold mb-4">Calendar</h3>
                    <CalendarView 
                      currentDate={selectedDate}
                      foodEntries={monthlyData}
                      onSelectDate={handleDateSelect}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Export Modal */}
      <ExportModal open={exportModalOpen} onOpenChange={setExportModalOpen} />
    </div>
  );
};

export default Dashboard;