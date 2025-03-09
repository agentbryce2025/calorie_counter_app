import React, { useMemo, useState } from 'react';
import VirtualizedList from './ui/VirtualizedList';
import { FoodEntry } from '../services/foodEntryService';

interface VirtualizedFoodListProps {
  entries: FoodEntry[];
  onEdit?: (entry: FoodEntry) => void;
  onDelete?: (entry: FoodEntry) => void;
  className?: string;
  maxHeight?: number;
  searchTerm?: string;
  sortBy?: 'name' | 'calories' | 'timestamp' | 'mealType';
  sortDirection?: 'asc' | 'desc';
}

/**
 * A virtualized list component specifically designed for rendering food entries.
 * Provides efficient rendering for large food entry datasets.
 */
const VirtualizedFoodList: React.FC<VirtualizedFoodListProps> = ({
  entries,
  onEdit,
  onDelete,
  className = '',
  maxHeight = 500,
  searchTerm = '',
  sortBy = 'timestamp',
  sortDirection = 'desc'
}) => {
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  
  // Filter entries based on search term
  const filteredEntries = useMemo(() => {
    if (!searchTerm) return entries;
    
    return entries.filter(entry => 
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.mealType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [entries, searchTerm]);
  
  // Sort entries based on sortBy and sortDirection
  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'calories':
          comparison = a.calories - b.calories;
          break;
        case 'mealType':
          comparison = a.mealType.localeCompare(b.mealType);
          break;
        case 'timestamp':
        default:
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredEntries, sortBy, sortDirection]);
  
  // Function to format the timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Render each food entry item
  const renderFoodEntry = (entry: FoodEntry, index: number) => {
    const isExpanded = expandedEntryId === entry.id;
    
    return (
      <div 
        className={`p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
      >
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{entry.name}</span>
            <span className="text-sm text-gray-500">
              {entry.mealType} • {formatTime(entry.timestamp)}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-gray-800">{entry.calories} cal</span>
            <div className="flex ml-4">
              {onEdit && (
                <button 
                  className="text-blue-600 hover:text-blue-800 mr-2 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(entry);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button 
                  className="text-red-600 hover:text-red-800 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Expanded details section */}
        {isExpanded && entry.nutritionalInfo && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <h4 className="font-medium text-sm text-gray-700 mb-1">Nutritional Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {entry.nutritionalInfo.protein && (
                <div>
                  <span className="text-gray-600">Protein:</span> {entry.nutritionalInfo.protein}g
                </div>
              )}
              {entry.nutritionalInfo.carbs && (
                <div>
                  <span className="text-gray-600">Carbs:</span> {entry.nutritionalInfo.carbs}g
                </div>
              )}
              {entry.nutritionalInfo.fat && (
                <div>
                  <span className="text-gray-600">Fat:</span> {entry.nutritionalInfo.fat}g
                </div>
              )}
              {entry.nutritionalInfo.fiber && (
                <div>
                  <span className="text-gray-600">Fiber:</span> {entry.nutritionalInfo.fiber}g
                </div>
              )}
              {entry.nutritionalInfo.sugar && (
                <div>
                  <span className="text-gray-600">Sugar:</span> {entry.nutritionalInfo.sugar}g
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {sortedEntries.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No food entries found.</p>
        </div>
      ) : (
        <VirtualizedList
          data={sortedEntries}
          height={maxHeight}
          itemHeight={expandedEntryId ? 140 : 70} // Adjust height based on whether an item is expanded
          renderItem={renderFoodEntry}
          itemKey={(item) => item.id}
          className="rounded-md border border-gray-200 shadow-sm"
        />
      )}
    </div>
  );
};

export default VirtualizedFoodList;