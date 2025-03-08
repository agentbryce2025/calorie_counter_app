import { getAuthToken } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Generic function to make API requests
const makeRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  data?: any
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'An error occurred');
    }

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Food Entry API Calls
export const fetchFoodEntries = async (startDate?: string, endDate?: string) => {
  let queryParams = '';
  if (startDate && endDate) {
    queryParams = `?startDate=${startDate}&endDate=${endDate}`;
  }
  return makeRequest(`/food-entries${queryParams}`);
};

export const fetchFoodEntriesByDate = async (date: string) => {
  return makeRequest(`/food-entries/date/${date}`);
};

export const createFoodEntry = async (entry: {
  name: string;
  calories: number;
  mealType: string;
  timestamp: string;
}) => {
  return makeRequest('/food-entries', 'POST', entry);
};

export const updateFoodEntry = async (
  id: string,
  entry: {
    name?: string;
    calories?: number;
    mealType?: string;
    timestamp?: string;
  }
) => {
  return makeRequest(`/food-entries/${id}`, 'PUT', entry);
};

export const deleteFoodEntry = async (id: string) => {
  return makeRequest(`/food-entries/${id}`, 'DELETE');
};

export const fetchFoodSummary = async (startDate: string, endDate: string) => {
  return makeRequest(`/food-entries/summary?startDate=${startDate}&endDate=${endDate}`);
};

// User API Calls
export const updateUserProfile = async (data: { dailyCalorieGoal?: number }) => {
  return makeRequest('/auth/profile', 'PUT', data);
};

export default {
  fetchFoodEntries,
  fetchFoodEntriesByDate,
  createFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
  fetchFoodSummary,
  updateUserProfile,
};