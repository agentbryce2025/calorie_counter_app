import { v4 as uuidv4 } from 'uuid';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isSameDay, isAfter, isBefore, addDays } from 'date-fns';

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: string;
  mealType: string;
  // Add missing properties that are referenced in components
  date?: string;
  protein?: number;
  carbs?: number;
  fat?: number;
  nutritionalInfo?: {
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
  };
}

// Mock initial data
const mockEntries: FoodEntry[] = [
  {
    id: '1',
    name: 'Oatmeal with Berries',
    calories: 320,
    timestamp: new Date(new Date().setHours(8, 30)).toISOString(),
    mealType: 'breakfast'
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    calories: 450,
    timestamp: new Date(new Date().setHours(12, 45)).toISOString(),
    mealType: 'lunch'
  },
  {
    id: '3',
    name: 'Apple',
    calories: 95,
    timestamp: new Date(new Date().setHours(15, 30)).toISOString(),
    mealType: 'snack'
  },
  {
    id: '4',
    name: 'Salmon with Vegetables',
    calories: 520,
    timestamp: new Date(new Date().setHours(19, 0)).toISOString(),
    mealType: 'dinner'
  }
];

// LocalStorage key
const STORAGE_KEY = 'calorieCounterFoodEntries';

// Initialize with mock data if storage is empty
const initializeStorage = (): void => {
  const storedEntries = localStorage.getItem(STORAGE_KEY);
  if (!storedEntries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEntries));
  }
};

// Get all food entries
export const getAllFoodEntries = (): FoodEntry[] => {
  initializeStorage();
  const storedEntries = localStorage.getItem(STORAGE_KEY);
  return storedEntries ? JSON.parse(storedEntries) : [];
};

// Add a new food entry
export const addFoodEntry = (entry: Omit<FoodEntry, 'id'>): FoodEntry => {
  const newEntry: FoodEntry = {
    ...entry,
    id: uuidv4()
  };
  
  const entries = getAllFoodEntries();
  const updatedEntries = [...entries, newEntry];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  return newEntry;
};

// Delete a food entry
export const deleteFoodEntry = (id: string): void => {
  const entries = getAllFoodEntries();
  const updatedEntries = entries.filter(entry => entry.id !== id);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
};

// Update a food entry
export const updateFoodEntry = (id: string, updatedData: Partial<FoodEntry>): FoodEntry | null => {
  const entries = getAllFoodEntries();
  const index = entries.findIndex(entry => entry.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Create updated entry
  const updatedEntry = { ...entries[index], ...updatedData };
  entries[index] = updatedEntry;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return updatedEntry;
};

// Get food entries for a specific date
export const getFoodEntriesByDate = (date: Date): FoodEntry[] => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const entries = getAllFoodEntries();
  
  return entries.filter(entry => {
    const entryDate = format(parseISO(entry.timestamp), 'yyyy-MM-dd');
    return entryDate === formattedDate;
  });
};

// Get total calories for a specific date
export const getTotalCaloriesByDate = (date: Date): number => {
  const entries = getFoodEntriesByDate(date);
  return entries.reduce((total, entry) => total + entry.calories, 0);
};

// Get food entries for the current week
export const getCurrentWeekFoodEntries = (date: Date): FoodEntry[] => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  
  const entries = getAllFoodEntries();
  
  return entries.filter(entry => {
    const entryDate = parseISO(entry.timestamp);
    return !isBefore(entryDate, start) && !isAfter(entryDate, end);
  });
};

// Get weekly calorie data (for charts)
export const getWeeklyCalorieData = (date: Date): { name: string; calories: number }[] => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  
  const weekDays = [];
  for (let i = 0; i <= 6; i++) {
    weekDays.push(addDays(start, i));
  }
  
  const entries = getAllFoodEntries();
  
  return weekDays.map(day => {
    const dayEntries = entries.filter(entry => {
      const entryDate = parseISO(entry.timestamp);
      return isSameDay(entryDate, day);
    });
    
    const totalCalories = dayEntries.reduce((total, entry) => total + entry.calories, 0);
    
    return {
      name: format(day, 'EEE'),
      calories: totalCalories
    };
  });
};

// Get food entries for the current month
export const getCurrentMonthFoodEntries = (date: Date): FoodEntry[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  const entries = getAllFoodEntries();
  
  return entries.filter(entry => {
    const entryDate = parseISO(entry.timestamp);
    return !isBefore(entryDate, start) && !isAfter(entryDate, end);
  });
};

// Get monthly data for calendar
export const getMonthlyCalorieData = (
  date: Date, 
  goalCalories: number
): { date: string; totalCalories: number; goalCalories: number }[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  const entries = getAllFoodEntries();
  const resultMap = new Map();
  
  // Initialize all days of the month with 0 calories
  let currentDay = start;
  while (currentDay <= end) {
    const dateKey = format(currentDay, 'yyyy-MM-dd');
    resultMap.set(dateKey, { 
      date: dateKey, 
      totalCalories: 0, 
      goalCalories 
    });
    currentDay = addDays(currentDay, 1);
  }
  
  // Fill in actual calories data
  entries.forEach(entry => {
    const entryDate = parseISO(entry.timestamp);
    if (!isBefore(entryDate, start) && !isAfter(entryDate, end)) {
      const dateKey = format(entryDate, 'yyyy-MM-dd');
      const currentData = resultMap.get(dateKey);
      
      if (currentData) {
        resultMap.set(dateKey, {
          ...currentData,
          totalCalories: currentData.totalCalories + entry.calories
        });
      }
    }
  });
  
  return Array.from(resultMap.values());
};

export default {
  getAllFoodEntries,
  addFoodEntry,
  deleteFoodEntry,
  updateFoodEntry,
  getFoodEntriesByDate,
  getTotalCaloriesByDate,
  getCurrentWeekFoodEntries,
  getWeeklyCalorieData,
  getCurrentMonthFoodEntries,
  getMonthlyCalorieData
};