import React, { useState, useEffect } from 'react';
import VoiceInputButton from './VoiceInputButton';
import { FoodEntityExtraction } from '../services/voiceInputService';
import BarcodeScanner from './BarcodeScanner';

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
  const [isListening, setIsListening] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string>('');

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
      setVoiceFeedback('');
    }
    
    setIsSubmitting(false);
  };

  // Handle voice input
  const handleVoiceInput = (data: FoodEntityExtraction) => {
    let feedbackMessage = 'Detected: ';
    let hasRecognizedData = false;
    
    if (data.foodName) {
      setFoodName(data.foodName);
      feedbackMessage += `Food: "${data.foodName}" `;
      hasRecognizedData = true;
    }
    
    if (data.calories) {
      setCalories(data.calories.toString());
      feedbackMessage += `Calories: ${data.calories} `;
      hasRecognizedData = true;
    }
    
    if (data.mealType) {
      setMealType(data.mealType);
      feedbackMessage += `Meal: ${data.mealType} `;
      hasRecognizedData = true;
    }
    
    if (hasRecognizedData) {
      setVoiceFeedback(feedbackMessage);
    } else {
      setVoiceFeedback('Sorry, I couldn\'t recognize food information. Please try again or enter manually.');
    }
    
    // Hide feedback after 5 seconds
    setTimeout(() => {
      setVoiceFeedback('');
    }, 5000);
  };
  
  // Handle barcode scan
  const handleBarcodeDetect = (barcodeData: any) => {
    if (barcodeData?.name) {
      setFoodName(barcodeData.name);
    }
    
    if (barcodeData?.calories) {
      setCalories(barcodeData.calories.toString());
    }
    
    if (barcodeData?.nutritionalInfo) {
      if (barcodeData.nutritionalInfo.carbs) {
        setCarbs(barcodeData.nutritionalInfo.carbs.toString());
      }
      
      if (barcodeData.nutritionalInfo.protein) {
        setProtein(barcodeData.nutritionalInfo.protein.toString());
      }
      
      if (barcodeData.nutritionalInfo.fat) {
        setFat(barcodeData.nutritionalInfo.fat.toString());
      }
      
      setShowNutrition(true);
    }
    
    setShowScanner(false);
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
      
      {/* Voice feedback message */}
      {voiceFeedback && (
        <div className={`mt-4 p-3 rounded-md ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
          <p>{voiceFeedback}</p>
        </div>
      )}
      
      {/* Barcode scanner modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-90 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl p-4 rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Scan Food Barcode</h3>
              <button 
                onClick={() => setShowScanner(false)}
                className="text-gray-700 hover:text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <BarcodeScanner onDetected={handleBarcodeDetect} onClose={() => setShowScanner(false)} />
          </div>
        </div>
      )}
      
      {/* Form buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button 
          type="submit" 
          className={`px-4 py-2 rounded-md ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          } ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white transition-opacity`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Food'}
        </button>
        
        {/* Voice input button */}
        <VoiceInputButton 
          onVoiceInput={handleVoiceInput}
          isListening={isListening}
          onListeningChange={setIsListening}
          className={darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'}
        />
        
        {/* Barcode scanner button */}
        <button
          type="button"
          onClick={() => setShowScanner(true)}
          className={`px-4 py-2 rounded-md text-white ${
            darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
            <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3z" />
          </svg>
          Scan Barcode
        </button>
      </div>
    </form>
  );
};

export default FoodEntryForm;