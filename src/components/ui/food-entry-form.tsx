import React, { useState } from 'react';

interface FoodEntryFormProps {
  onAddFood: (food: { name: string; calories: number; timestamp: string; mealType: string }) => void;
}

export const FoodEntryForm: React.FC<FoodEntryFormProps> = ({ onAddFood }) => {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('breakfast');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!food.trim() || !calories.trim()) {
      return;
    }
    
    onAddFood({
      name: food,
      calories: parseInt(calories),
      timestamp: new Date().toISOString(),
      mealType
    });
    
    // Reset form
    setFood('');
    setCalories('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Add Food Entry</h2>
      
      <div>
        <label htmlFor="food" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Food Name
        </label>
        <input
          type="text"
          id="food"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
          placeholder="e.g., Banana"
          required
        />
      </div>
      
      <div>
        <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Calories
        </label>
        <input
          type="number"
          id="calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
          placeholder="e.g., 105"
          min="0"
          required
        />
      </div>
      
      <div>
        <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Meal Type
        </label>
        <select
          id="mealType"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>
      
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Food
      </button>
    </form>
  );
};

export default FoodEntryForm;