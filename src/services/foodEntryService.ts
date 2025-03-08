import { format } from 'date-fns';

export interface FoodEntry {
  id: number;
  name: string;
  calories: number;
  date: Date;
}

const STORAGE_KEY = 'calorieTracker_foodEntries';

// Convert date strings back to Date objects when retrieving from storage
const parseEntries = (entries: any[]): FoodEntry[] => {
  return entries.map(entry => ({
    ...entry,
    date: new Date(entry.date)
  }));
};

// Add some initial sample data if storage is empty
const generateInitialEntries = (): FoodEntry[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  return [
    { id: 1, name: "Coffee with milk", calories: 50, date: new Date(today.setHours(7, 15)) },
    { id: 2, name: "Oatmeal with fruit", calories: 320, date: new Date(today.setHours(8, 30)) },
    { id: 3, name: "Grilled chicken sandwich", calories: 450, date: new Date(today.setHours(12, 30)) },
    { id: 4, name: "Protein Bar", calories: 180, date: new Date(yesterday.setHours(10, 0)) },
    { id: 5, name: "Pasta with vegetables", calories: 520, date: new Date(yesterday.setHours(18, 45)) },
    { id: 6, name: "Banana", calories: 105, date: new Date(twoDaysAgo.setHours(9, 30)) },
    { id: 7, name: "Salad with tuna", calories: 350, date: new Date(twoDaysAgo.setHours(13, 0)) },
    { id: 8, name: "Steak with potatoes", calories: 680, date: new Date(twoDaysAgo.setHours(19, 30)) },
  ];
};

// Get all food entries
export const getAllFoodEntries = (): FoodEntry[] => {
  try {
    const entries = localStorage.getItem(STORAGE_KEY);
    if (!entries) {
      const initialEntries = generateInitialEntries();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEntries));
      return initialEntries;
    }
    return parseEntries(JSON.parse(entries));
  } catch (error) {
    console.error('Error getting food entries:', error);
    return [];
  }
};

// Add a new food entry
export const addFoodEntry = (entry: Omit<FoodEntry, 'id'>): FoodEntry => {
  try {
    const entries = getAllFoodEntries();
    const newEntry = {
      ...entry,
      id: Date.now() // Use timestamp as a simple unique ID
    };
    
    const updatedEntries = [newEntry, ...entries];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    return newEntry;
  } catch (error) {
    console.error('Error adding food entry:', error);
    throw error;
  }
};

// Delete a food entry by ID
export const deleteFoodEntry = (id: number): void => {
  try {
    const entries = getAllFoodEntries();
    const updatedEntries = entries.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  } catch (error) {
    console.error('Error deleting food entry:', error);
    throw error;
  }
};

// Get entries for a specific date
export const getEntriesForDate = (date: Date): FoodEntry[] => {
  const entries = getAllFoodEntries();
  return entries.filter(entry => 
    format(entry.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );
};

// Get entries grouped by day (for the past 7 days)
export const getWeeklyEntries = (): Record<string, FoodEntry[]> => {
  const entries = getAllFoodEntries();
  const result: Record<string, FoodEntry[]> = {};
  
  // Get data for past 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    result[dateStr] = entries.filter(entry => 
      format(entry.date, 'yyyy-MM-dd') === dateStr
    );
  }
  
  return result;
};

// Calculate total calories for a date
export const getTotalCaloriesForDate = (date: Date): number => {
  const entries = getEntriesForDate(date);
  return entries.reduce((sum, entry) => sum + entry.calories, 0);
};

// Get summary data for charts (past 7 days)
export const getWeeklyCalorieData = () => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const result = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = daysOfWeek[date.getDay()];
    const entries = getEntriesForDate(date);
    const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
    
    result.push({
      id: 7 - i,
      day: dayName,
      calories: totalCalories,
      goal: 2000
    });
  }
  
  return result;
};

// Get data for monthly view
export const getMonthlyCalorieData = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const result = [];
  const entries = getAllFoodEntries();
  
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const dayEntries = entries.filter(entry => 
      format(entry.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    const totalCalories = dayEntries.reduce((sum, entry) => sum + entry.calories, 0);
    
    result.push({
      id: i,
      date: date,
      day: i,
      calories: totalCalories,
      goal: 2000
    });
  }
  
  return result;
};