const DARK_MODE_KEY = 'calorieTracker_darkMode';
const CALORIE_GOAL_KEY = 'calorieTracker_calorieGoal';

// Get dark mode preference
export const getDarkModePreference = (): boolean => {
  try {
    const storedPreference = localStorage.getItem(DARK_MODE_KEY);
    if (storedPreference === null) {
      // Default to system preference if not set
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      localStorage.setItem(DARK_MODE_KEY, String(prefersDark));
      return prefersDark;
    }
    return storedPreference === 'true';
  } catch (error) {
    console.error('Error getting dark mode preference:', error);
    return false;
  }
};

// Save dark mode preference
export const saveDarkModePreference = (isDarkMode: boolean): void => {
  try {
    localStorage.setItem(DARK_MODE_KEY, String(isDarkMode));
  } catch (error) {
    console.error('Error saving dark mode preference:', error);
  }
};

// Get user's calorie goal
export const getCalorieGoal = (): number => {
  try {
    const storedGoal = localStorage.getItem(CALORIE_GOAL_KEY);
    if (storedGoal === null) {
      // Default to 2000 calories if not set
      localStorage.setItem(CALORIE_GOAL_KEY, '2000');
      return 2000;
    }
    return parseInt(storedGoal, 10);
  } catch (error) {
    console.error('Error getting calorie goal:', error);
    return 2000;
  }
};

// Save user's calorie goal
export const saveCalorieGoal = (goal: number): void => {
  try {
    localStorage.setItem(CALORIE_GOAL_KEY, String(goal));
  } catch (error) {
    console.error('Error saving calorie goal:', error);
  }
};