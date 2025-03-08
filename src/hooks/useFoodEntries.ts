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
          setEntries(response.entries);
        } else {
          response = await apiService.fetchFoodEntries();
          setEntries(response.entries);
        }
      } else {
        // Use localStorage service as fallback
        const localEntries = date 
          ? foodEntryService.getFoodEntriesByDate(date) 
          : foodEntryService.getAllFoodEntries();
        setEntries(localEntries);
      }
    } catch (err) {
      setError('Failed to fetch food entries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [date, useApi]);

  const addEntry = async (newEntry: NewFoodEntry): Promise<FoodEntry | null> => {
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
      setError('Failed to add food entry');
      console.error(err);
      return null;
    }
  };

  const updateEntry = async (id: string, updatedEntry: Partial<FoodEntry>): Promise<boolean> => {
    try {
      if (useApi) {
        await apiService.updateFoodEntry(id, updatedEntry);
        await fetchEntries(); // Refresh the list
        return true;
      } else {
        // Not implemented in local storage service yet
        console.warn('Update not implemented in localStorage service');
        return false;
      }
    } catch (err) {
      setError('Failed to update food entry');
      console.error(err);
      return false;
    }
  };

  const deleteEntry = async (id: string): Promise<boolean> => {
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
      setError('Failed to delete food entry');
      console.error(err);
      return false;
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