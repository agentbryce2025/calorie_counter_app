import React, { useState } from 'react';
import { format } from 'date-fns';
import VirtualizedFoodList from './VirtualizedFoodList';
import { FoodEntry } from '../services/foodEntryService';

interface DailyDetailProps {
  darkMode: boolean;
  selectedDate: Date;
  foods: FoodEntry[];
  totalCalories: number;
  calorieGoal: number;
  onDeleteFood?: (entry: FoodEntry) => void;
  onEditFood?: (entry: FoodEntry) => void;
}

const DailyDetail: React.FC<DailyDetailProps> = ({
  darkMode,
  selectedDate,
  foods,
  totalCalories,
  calorieGoal,
  onDeleteFood,
  onEditFood
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'calories' | 'timestamp' | 'mealType'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const isOverGoal = totalCalories > calorieGoal;
  const percentOfGoal = Math.round((totalCalories / calorieGoal) * 100);
  
  // Handle sorting change
  const handleSortChange = (field: 'name' | 'calories' | 'timestamp' | 'mealType') => {
    if (field === sortBy) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  return (
    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white border'}`}>
      <h2 className="text-xl font-bold mb-4">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Calories:</span>
              <span className="font-bold">{totalCalories}</span>
            </div>
            <div className="flex justify-between">
              <span>Daily Goal:</span>
              <span>{calorieGoal}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`font-bold ${isOverGoal ? 'text-red-500' : 'text-green-500'}`}>
                {isOverGoal ? 'Over Goal' : 'Within Goal'}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className="text-lg font-semibold mb-2">Goal Progress</h3>
          <div className="space-y-2">
            <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
              <div 
                className={`h-full ${isOverGoal ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(percentOfGoal, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-sm">
              {percentOfGoal}% of daily goal
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Food Entries</h3>
        
        {/* Search and sort controls */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search food entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`p-2 w-full md:w-64 rounded-md ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
              } border`}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className={`p-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="timestamp">Time</option>
              <option value="name">Name</option>
              <option value="calories">Calories</option>
              <option value="mealType">Meal Type</option>
            </select>
            
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className={`p-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>
        </div>
        
        {/* Virtualized food list */}
        {foods.length > 0 ? (
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg`}>
            <VirtualizedFoodList
              entries={foods}
              onEdit={onEditFood}
              onDelete={onDeleteFood}
              searchTerm={searchTerm}
              sortBy={sortBy}
              sortDirection={sortDirection}
              maxHeight={500}
              className={darkMode ? 'text-white' : 'text-gray-800'}
            />
          </div>
        ) : (
          <p className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg text-center`}>
            No food entries for this day. Add your first meal!
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyDetail;