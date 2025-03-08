import React from 'react';
import { format } from 'date-fns';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: string;
  mealType: string;
}

interface DailyTimelineProps {
  entries: FoodEntry[];
  onDeleteEntry: (id: string) => void;
}

export const DailyTimeline: React.FC<DailyTimelineProps> = ({ entries, onDeleteEntry }) => {
  // Group entries by meal type
  const mealGroups = {
    breakfast: entries.filter(entry => entry.mealType === 'breakfast'),
    lunch: entries.filter(entry => entry.mealType === 'lunch'),
    dinner: entries.filter(entry => entry.mealType === 'dinner'),
    snack: entries.filter(entry => entry.mealType === 'snack')
  };

  const mealIcons: Record<string, string> = {
    breakfast: '☕',
    lunch: '🍲',
    dinner: '🍽️',
    snack: '🍌'
  };

  return (
    <div className="space-y-6 mt-4">
      {Object.entries(mealGroups).map(([mealType, mealEntries]) => (
        <div key={mealType} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-3">
            <span className="text-xl mr-2">{mealIcons[mealType]}</span>
            <h3 className="text-lg font-medium capitalize text-gray-900 dark:text-gray-100">
              {mealType}
            </h3>
          </div>
          
          {mealEntries.length > 0 ? (
            <ul className="space-y-3">
              {mealEntries.map((entry) => (
                <li 
                  key={entry.id} 
                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{entry.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(entry.timestamp), 'h:mm a')} • {entry.calories} calories
                    </p>
                  </div>
                  <button 
                    onClick={() => onDeleteEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label="Delete entry"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">No entries for {mealType}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DailyTimeline;