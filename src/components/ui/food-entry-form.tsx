import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
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
  darkMode?: boolean;
}

export const FoodEntryForm: React.FC<FoodEntryFormProps> = ({ onAddFood, darkMode = true }) => {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [showNutrition, setShowNutrition] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!food.trim() || !calories.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
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
    setIsSubmitting(false);
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
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Add Food</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="food" className="block text-sm font-medium mb-1 text-gray-200">
            Food Name
          </label>
          <div className="flex rounded-md">
            <input
              type="text"
              id="food"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              className="flex-1 px-3 py-2 rounded-l-md bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g., Grilled Chicken Salad"
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="inline-flex items-center justify-center px-3 py-2 rounded-r-md bg-gray-800 border border-l-0 border-gray-700 text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="calories" className="block text-sm font-medium mb-1 text-gray-200">
              Calories
            </label>
            <input
              type="number"
              id="calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g., 350"
              min="0"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="mealType" className="block text-sm font-medium mb-1 text-gray-200">
              Meal Type
            </label>
            <select
              id="mealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>
        
        <button
          type="button"
          onClick={() => setShowNutrition(!showNutrition)}
          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
        >
          {showNutrition ? '- Hide' : '+ Add'} nutritional details
        </button>
        
        {showNutrition && (
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-800">
            <div>
              <label htmlFor="carbs" className="block text-sm font-medium mb-1 text-gray-200">
                Carbs (g)
              </label>
              <input
                type="number"
                id="carbs"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.1"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="protein" className="block text-sm font-medium mb-1 text-gray-200">
                Protein (g)
              </label>
              <input
                type="number"
                id="protein"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.1"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="fat" className="block text-sm font-medium mb-1 text-gray-200">
                Fat (g)
              </label>
              <input
                type="number"
                id="fat"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.1"
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || !food || !calories || !mealType}
          className="w-full py-2 px-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Adding...' : 'Add Food'}
        </button>
      </form>
      
      {/* Barcode Scanner Modal */}
      {scannerOpen && (
        <BarcodeScannerModal
          isOpen={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onProductFound={handleScannerResult}
        />
      )}
    </div>
  );
};

export default FoodEntryForm;