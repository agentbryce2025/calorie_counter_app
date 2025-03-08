import React, { useState } from 'react';

interface FoodEntryFormProps {
  darkMode: boolean;
  onAddFood: (foodName: string, calories: number, mealType: string) => void;
}

type ValidationErrors = {
  foodName?: string;
  calories?: string;
  mealType?: string;
};

const FoodEntryForm = ({ darkMode, onAddFood }: FoodEntryFormProps) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validate food name
    if (!foodName.trim()) {
      newErrors.foodName = 'Food name is required';
    } else if (foodName.length > 50) {
      newErrors.foodName = 'Food name cannot exceed 50 characters';
    }
    
    // Validate calories
    if (!calories) {
      newErrors.calories = 'Calories are required';
    } else {
      const caloriesNum = parseInt(calories);
      if (isNaN(caloriesNum)) {
        newErrors.calories = 'Calories must be a number';
      } else if (caloriesNum <= 0) {
        newErrors.calories = 'Calories must be greater than 0';
      } else if (caloriesNum > 10000) {
        newErrors.calories = 'Calories cannot exceed 10,000';
      }
    }
    
    // Validate meal type
    if (!mealType) {
      newErrors.mealType = 'Meal type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validateForm()) {
      onAddFood(foodName, parseInt(calories), mealType);
      // Reset form after successful submission
      setFoodName('');
      setCalories('');
      setMealType('');
      setErrors({});
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white border'}`}>
      <h2 className="text-xl font-bold mb-4">Add Food Item</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="foodName" className="block mb-2">Food Name</label>
          <input 
            id="foodName"
            name="foodName"
            type="text" 
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className={`w-full p-2 rounded-md ${
              errors.foodName ? 'border-2 border-red-500' : ''
            } ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
            placeholder="Enter food name"
            required
            aria-required="true"
            disabled={isSubmitting}
          />
          {errors.foodName && (
            <p className="text-red-500 text-sm mt-1">{errors.foodName}</p>
          )}
        </div>
        <div>
          <label htmlFor="calories" className="block mb-2">Calories</label>
          <input 
            id="calories"
            name="calories"
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)} 
            className={`w-full p-2 rounded-md ${
              errors.calories ? 'border-2 border-red-500' : ''
            } ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
            placeholder="Enter calories"
            required
            min="1"
            max="10000"
            aria-required="true"
            disabled={isSubmitting}
          />
          {errors.calories && (
            <p className="text-red-500 text-sm mt-1">{errors.calories}</p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="mealType" className="block mb-2">Meal Type</label>
        <select
          id="mealType"
          name="mealType"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className={`w-full p-2 rounded-md ${
            errors.mealType ? 'border-2 border-red-500' : ''
          } ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          required
          aria-required="true"
          disabled={isSubmitting}
        >
          <option value="">Select Meal Type</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
        {errors.mealType && (
          <p className="text-red-500 text-sm mt-1">{errors.mealType}</p>
        )}
      </div>
      <button 
        type="submit" 
        className={`mt-4 px-4 py-2 rounded-md ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
        } ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white transition-opacity`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Food'}
      </button>
    </form>
  );
};

export default FoodEntryForm;