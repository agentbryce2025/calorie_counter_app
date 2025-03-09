import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'; // Changed from ScannerIcon which doesn't exist
import BarcodeScannerModal from './BarcodeScannerModal';

interface FoodEntryFormProps {
  onAddFood: (food: { 
    name: string; 
    calories: number; 
    timestamp: string; 
    mealType: string;
    carbs?: number;
    protein?: number;
    fat?: number; 
  }) => void;
}

export const FoodEntryForm: React.FC<FoodEntryFormProps> = ({ onAddFood }) => {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [showNutrition, setShowNutrition] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!food.trim() || !calories.trim()) {
      return;
    }
    
    const foodEntry = {
      name: food,
      calories: parseInt(calories),
      timestamp: new Date().toISOString(),
      mealType,
      ...(carbs && { carbs: parseFloat(carbs) }),
      ...(protein && { protein: parseFloat(protein) }),
      ...(fat && { fat: parseFloat(fat) })
    };
    
    onAddFood(foodEntry);
    
    // Reset form
    setFood('');
    setCalories('');
    setCarbs('');
    setProtein('');
    setFat('');
    setShowNutrition(false);
  };
  
  const handleScannerResult = (product: { 
    name: string; 
    calories: number; 
    carbs?: number; 
    protein?: number; 
    fat?: number; 
  }) => {
    setFood(product.name);
    setCalories(product.calories.toString());
    
    if (product.carbs !== undefined || product.protein !== undefined || product.fat !== undefined) {
      if (product.carbs !== undefined) setCarbs(product.carbs.toString());
      if (product.protein !== undefined) setProtein(product.protein.toString());
      if (product.fat !== undefined) setFat(product.fat.toString());
      setShowNutrition(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Add Food Entry</h2>
      
      <div>
        <label htmlFor="food" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Food Name
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="food"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="flex-1 min-w-0 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
            placeholder="e.g., Banana"
            required
          />
          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300 rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
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
      
      {/* Additional nutritional information fields */}
      {showNutrition ? (
        <div className="space-y-4 border-t pt-4 border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Nutritional Information
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Carbs (g)
              </label>
              <input
                type="number"
                id="carbs"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
            
            <div>
              <label htmlFor="protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Protein (g)
              </label>
              <input
                type="number"
                id="protein"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
            
            <div>
              <label htmlFor="fat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fat (g)
              </label>
              <input
                type="number"
                id="fat"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setShowNutrition(false)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Hide nutrition details
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNutrition(true)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          + Add nutrition details (carbs, protein, fat)
        </button>
      )}
      
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Food
      </button>
      
      {/* Barcode Scanner Modal */}
      {scannerOpen && (
        <BarcodeScannerModal
          isOpen={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onProductFound={handleScannerResult}
        />
      )}
    </form>
  );
};

export default FoodEntryForm;