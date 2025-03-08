import React from 'react';
import { format } from 'date-fns';

interface FoodItem {
  id: number;
  name: string;
  calories: number;
  time: Date;
}

interface DailyDetailProps {
  darkMode: boolean;
  selectedDate: Date;
  foods: FoodItem[];
  totalCalories: number;
  calorieGoal: number;
  onDeleteFood?: (id: number) => void;
}

const DailyDetail: React.FC<DailyDetailProps> = ({
  darkMode,
  selectedDate,
  foods,
  totalCalories,
  calorieGoal,
  onDeleteFood
}) => {
  const isOverGoal = totalCalories > calorieGoal;
  const percentOfGoal = Math.round((totalCalories / calorieGoal) * 100);
  
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
      
      <h3 className="text-lg font-semibold mb-2">Food Entries</h3>
      {foods.length > 0 ? (
        <div className={`overflow-x-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg`}>
          <table className="min-w-full">
            <thead>
              <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                <th className="py-2 px-4 text-left">Food</th>
                <th className="py-2 px-4 text-left">Calories</th>
                <th className="py-2 px-4 text-left">Time</th>
                {onDeleteFood && <th className="py-2 px-4 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {foods.map(food => (
                <tr key={food.id} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                  <td className="py-2 px-4">{food.name}</td>
                  <td className="py-2 px-4">{food.calories}</td>
                  <td className="py-2 px-4">{format(food.time, 'h:mm a')}</td>
                  {onDeleteFood && (
                    <td className="py-2 px-4">
                      <button 
                        onClick={() => onDeleteFood(food.id)}
                        className={`px-2 py-1 rounded-md text-sm ${darkMode ? 'bg-red-900 hover:bg-red-800' : 'bg-red-100 hover:bg-red-200'} text-red-600`}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg text-center`}>
          No food entries for this day. Add your first meal!
        </p>
      )}
    </div>
  );
};

export default DailyDetail;