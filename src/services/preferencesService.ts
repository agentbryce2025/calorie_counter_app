// LocalStorage keys
const DARK_MODE_KEY = 'calorieCounterDarkMode';
const CALORIE_GOAL_KEY = 'calorieCounterDailyGoal';

// Get dark mode preference
export const getDarkModePreference = (): boolean => {
  const stored = localStorage.getItem(DARK_MODE_KEY);
  
  if (stored === null) {
    // Check if system prefers dark mode
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark;
  }
  
  return stored === 'true';
};

// Set dark mode preference
export const setDarkModePreference = (isDarkMode: boolean): void => {
  localStorage.setItem(DARK_MODE_KEY, isDarkMode.toString());
};

// Toggle dark mode
export const toggleDarkMode = (): boolean => {
  const current = getDarkModePreference();
  const newValue = !current;
  setDarkModePreference(newValue);
  return newValue;
};

// Update document class based on dark mode preference
export const applyDarkModeToDocument = (): void => {
  const isDarkMode = getDarkModePreference();
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Get daily calorie goal
export const getDailyCalorieGoal = (): number => {
  const stored = localStorage.getItem(CALORIE_GOAL_KEY);
  return stored ? parseInt(stored) : 2000; // Default to 2000 calories
};

// Set daily calorie goal
export const setDailyCalorieGoal = (calories: number): void => {
  localStorage.setItem(CALORIE_GOAL_KEY, calories.toString());
};

export default {
  getDarkModePreference,
  setDarkModePreference,
  toggleDarkMode,
  applyDarkModeToDocument,
  getDailyCalorieGoal,
  setDailyCalorieGoal
};