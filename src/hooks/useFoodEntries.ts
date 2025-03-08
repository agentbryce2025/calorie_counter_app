import { useState, useEffect, useCallback } from 'react';
import * as apiService from '../services/apiService';
import * as foodEntryService from '../services/foodEntryService';
import { useAuth } from '../contexts/AuthContext';

// This hook provides a unified way to work with food entries
// It uses the local storage service for now, but can be switched to the API service
// when the backend is ready

export type FoodEntry = {
  id: string;
  name: string;
  calories: number;
  timestamp: string;
  mealType: string;
};

export type NewFoodEntry = Omit<FoodEntry, 'id'>;

export const useFoodEntries = (date?: Date) => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Use the API when authenticated, otherwise fall back to localStorage
  const useApi = isAuthenticated;

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (useApi) {
        // Use the API service when authentication is ready
        const formattedDate = date ? new Date(date).toISOString().split('T')[0] : undefined;
        let response;
        
        if (formattedDate) {
          response = await apiService.fetchFoodEntriesByDate(formattedDate);
          setEntries(response.entries || []);
        } else {
          response = await apiService.fetchFoodEntries();
          setEntries(response.entries || []);
        }
      } else {
        // Use localStorage service as fallback
        const localEntries = date 
          ? foodEntryService.getFoodEntriesByDate(date) 
          : foodEntryService.getAllFoodEntries();
        setEntries(localEntries);
      }
    } catch (err) {
      // Store the actual error object instead of just a string
      console.error('Error fetching entries:', err);
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Failed to fetch food entries'));
      }
      
      // If API fails, try to fall back to localStorage as a backup
      if (useApi) {
        try {
          console.log('Falling back to localStorage after API failure');
          const localEntries = date 
            ? foodEntryService.getFoodEntriesByDate(date) 
            : foodEntryService.getAllFoodEntries();
          setEntries(localEntries);
        } catch (fallbackErr) {
          console.error('Fallback to localStorage also failed:', fallbackErr);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [date, useApi]);

  const addEntry = async (newEntry: NewFoodEntry): Promise<FoodEntry | null> => {
    setLoading(true);
    setError(null);
    try {
      if (useApi) {
        const response = await apiService.createFoodEntry(newEntry);
        await fetchEntries(); // Refresh the list
        return response.entry;
      } else {
        const entry = foodEntryService.addFoodEntry(newEntry);
        await fetchEntries(); // Refresh the list
        return entry;
      }
    } catch (err) {
      console.error('Error adding food entry:', err);
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Failed to add food entry'));
      }
      
      // Try local storage as fallback
      if (useApi) {
        try {
          console.log('Falling back to localStorage after API failure on add');
          const entry = foodEntryService.addFoodEntry(newEntry);
          await fetchEntries(); // Refresh the list
          return entry;
        } catch (fallbackErr) {
          console.error('Fallback to localStorage also failed on add:', fallbackErr);
        }
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (id: string, updatedEntry: Partial<FoodEntry>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (useApi) {
        await apiService.updateFoodEntry(id, updatedEntry);
        await fetchEntries(); // Refresh the list
        return true;
      } else {
        const result = foodEntryService.updateFoodEntry(id, updatedEntry);
        await fetchEntries(); // Refresh the list
        return result !== null;
      }
    } catch (err) {
      console.error('Error updating food entry:', err);
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Failed to update food entry'));
      }
      
      // Try local storage as fallback
      if (useApi) {
        try {
          console.log('Falling back to localStorage after API failure on update');
          const result = foodEntryService.updateFoodEntry(id, updatedEntry);
          await fetchEntries(); // Refresh the list
          return result !== null;
        } catch (fallbackErr) {
          console.error('Fallback to localStorage also failed on update:', fallbackErr);
        }
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (useApi) {
        await apiService.deleteFoodEntry(id);
        await fetchEntries(); // Refresh the list
        return true;
      } else {
        foodEntryService.deleteFoodEntry(id);
        await fetchEntries(); // Refresh the list
        return true;
      }
    } catch (err) {
      console.error('Error deleting food entry:', err);
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Failed to delete food entry'));
      }
      
      // Try local storage as fallback
      if (useApi) {
        try {
          console.log('Falling back to localStorage after API failure on delete');
          foodEntryService.deleteFoodEntry(id);
          await fetchEntries(); // Refresh the list
          return true;
        } catch (fallbackErr) {
          console.error('Fallback to localStorage also failed on delete:', fallbackErr);
        }
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return {
    entries,
    loading,
    error,
    fetchEntries,
    addEntry,
    updateEntry,
    deleteEntry
  };
};

export default useFoodEntries;