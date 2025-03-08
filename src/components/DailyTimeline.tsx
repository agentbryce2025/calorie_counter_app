import React from 'react';
import { format } from 'date-fns';

interface TimelineEntry {
  id: number;
  name: string;
  calories: number;
  time: Date;
}

interface DailyTimelineProps {
  entries: TimelineEntry[];
  onDeleteEntry?: (id: number) => void;
  darkMode: boolean;
}

const DailyTimeline: React.FC<DailyTimelineProps> = ({
  entries,
  onDeleteEntry,
  darkMode
}) => {
  // Generate all hours from 5 AM to 10 PM
  const hours = Array.from({ length: 18 }, (_, i) => i + 5);
  
  // Group entries by hour
  const entriesByHour = hours.reduce((acc, hour) => {
    acc[hour] = entries.filter(entry => {
      const entryHour = entry.time.getHours();
      return entryHour === hour;
    });
    return acc;
  }, {} as Record<number, TimelineEntry[]>);

  return (
    <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      {hours.map(hour => (
        <div 
          key={hour} 
          className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-start`}
        >
          <div className="w-20 font-medium">
            {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
          </div>
          
          <div className="flex-1">
            {entriesByHour[hour]?.length > 0 ? (
              <div className="space-y-2">
                {entriesByHour[hour].map(entry => (
                  <div 
                    key={entry.id} 
                    className={`flex justify-between items-center p-2 rounded-md ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <div>
                      <span className="font-medium">{entry.name}</span>
                      <div className="text-sm opacity-75">
                        {format(entry.time, 'h:mm a')}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="font-bold">{entry.calories} cal</span>
                      
                      {onDeleteEntry && (
                        <button 
                          onClick={() => onDeleteEntry(entry.id)}
                          className={`px-2 py-1 rounded text-sm ${
                            darkMode ? 'bg-red-900 hover:bg-red-800 text-red-100' : 'bg-red-100 hover:bg-red-200 text-red-600'
                          }`}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {/* Empty hour slot */}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyTimeline;