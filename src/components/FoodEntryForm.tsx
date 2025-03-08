import React, { useState } from 'react';

interface FoodEntryFormProps {
  darkMode: boolean;
  onAddFood: (foodName: string, calories: number) => void;
}

const FoodEntryForm = ({ darkMode, onAddFood }: FoodEntryFormProps) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (foodName && calories) {
      onAddFood(foodName, parseInt(calories));
      setFoodName('');
      setCalories('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white border'}`}>
      <h2 className="text-xl font-bold mb-4">Add Food Item</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Food Name</label>
          <input 
            type="text" 
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
            placeholder="Enter food name"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Calories</label>
          <input 
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)} 
            className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
            placeholder="Enter calories"
            required
            min="1"
          />
        </div>
      </div>
      <button 
        type="submit" 
        className={`mt-4 px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white hover:opacity-90 transition-opacity`}
      >
        Add Food
      </button>
    </form>
  );
};

export default FoodEntryForm;