import React, { useState } from 'react';

interface FoodEntryFormProps {
  darkMode: boolean;
  onAddFood: (foodName: string, calories: number, mealType: string, carbs?: number, protein?: number, fat?: number) => void;
}

type ValidationErrors = {
  foodName?: string;
  calories?: string;
  mealType?: string;
  carbs?: string;
  protein?: string;
  fat?: string;
};

const FoodEntryForm = ({ darkMode, onAddFood }: FoodEntryFormProps) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [showNutrition, setShowNutrition] = useState(false);
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
    
    // Validate optional nutritional info if provided
    if (showNutrition) {
      if (carbs && carbs.trim() !== '') {
        const carbsNum = parseFloat(carbs);
        if (isNaN(carbsNum)) {
          newErrors.carbs = 'Carbs must be a number';
        } else if (carbsNum < 0) {
          newErrors.carbs = 'Carbs cannot be negative';
        } else if (carbsNum > 1000) {
          newErrors.carbs = 'Carbs cannot exceed 1,000g';
        }
      }
      
      if (protein && protein.trim() !== '') {
        const proteinNum = parseFloat(protein);
        if (isNaN(proteinNum)) {
          newErrors.protein = 'Protein must be a number';
        } else if (proteinNum < 0) {
          newErrors.protein = 'Protein cannot be negative';
        } else if (proteinNum > 1000) {
          newErrors.protein = 'Protein cannot exceed 1,000g';
        }
      }
      
      if (fat && fat.trim() !== '') {
        const fatNum = parseFloat(fat);
        if (isNaN(fatNum)) {
          newErrors.fat = 'Fat must be a number';
        } else if (fatNum < 0) {
          newErrors.fat = 'Fat cannot be negative';
        } else if (fatNum > 1000) {
          newErrors.fat = 'Fat cannot exceed 1,000g';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validateForm()) {
      // Parse values, convert empty strings to undefined
      const carbsValue = carbs.trim() !== '' ? parseFloat(carbs) : undefined;
      const proteinValue = protein.trim() !== '' ? parseFloat(protein) : undefined;
      const fatValue = fat.trim() !== '' ? parseFloat(fat) : undefined;
      
      onAddFood(
        foodName, 
        parseInt(calories), 
        mealType,
        carbsValue,
        proteinValue,
        fatValue
      );
      
      // Reset form after successful submission
      setFoodName('');
      setCalories('');
      setMealType('');
      setCarbs('');
      setProtein('');
      setFat('');
      setErrors({});
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white border'}`}>
      <h2 className="text-xl font-bold mb-4">Add Food Item</h2>
      
      {/* Basic food information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="foodName" className="block text-sm font-medium mb-1">Food Name</label>
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
          <label htmlFor="calories" className="block text-sm font-medium mb-1">Calories</label>
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
      
      <div className="mt-3">
        <label htmlFor="mealType" className="block text-sm font-medium mb-1">Meal Type</label>
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
      
      {/* Toggle for nutritional information */}
      <div className="mt-4">
        <button 
          type="button"
          onClick={() => setShowNutrition(!showNutrition)}
          className={`text-sm font-medium flex items-center ${
            darkMode ? 'text-blue-400' : 'text-blue-600'
          }`}
        >
          {showNutrition ? '- Hide' : '+ Add'} Nutritional Information
        </button>
      </div>
      
      {/* Nutritional information fields */}
      {showNutrition && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-md font-medium mb-2">Nutritional Information (optional)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="carbs" className="block text-sm font-medium mb-1">Carbs (g)</label>
              <input 
                id="carbs"
                name="carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)} 
                className={`w-full p-2 rounded-md ${
                  errors.carbs ? 'border-2 border-red-500' : ''
                } ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                placeholder="Carbs in grams"
                min="0"
                step="0.1"
                disabled={isSubmitting}
              />
              {errors.carbs && (
                <p className="text-red-500 text-sm mt-1">{errors.carbs}</p>
              )}
            </div>
            <div>
              <label htmlFor="protein" className="block text-sm font-medium mb-1">Protein (g)</label>
              <input 
                id="protein"
                name="protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)} 
                className={`w-full p-2 rounded-md ${
                  errors.protein ? 'border-2 border-red-500' : ''
                } ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                placeholder="Protein in grams"
                min="0"
                step="0.1"
                disabled={isSubmitting}
              />
              {errors.protein && (
                <p className="text-red-500 text-sm mt-1">{errors.protein}</p>
              )}
            </div>
            <div>
              <label htmlFor="fat" className="block text-sm font-medium mb-1">Fat (g)</label>
              <input 
                id="fat"
                name="fat"
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)} 
                className={`w-full p-2 rounded-md ${
                  errors.fat ? 'border-2 border-red-500' : ''
                } ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                placeholder="Fat in grams"
                min="0"
                step="0.1"
                disabled={isSubmitting}
              />
              {errors.fat && (
                <p className="text-red-500 text-sm mt-1">{errors.fat}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <button 
        type="submit" 
        className={`mt-4 w-full sm:w-auto px-4 py-2 rounded-md ${
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