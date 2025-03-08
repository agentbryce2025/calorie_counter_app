import { getAuthToken } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Network error class
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Timeout error class
export class TimeoutError extends Error {
  constructor(message: string = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Generic function to make API requests with improved error handling
const makeRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  timeout: number = 30000 // 30 seconds timeout
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

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  config.signal = controller.signal;

  try {
    // Attempt the fetch request
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Clear the timeout regardless of outcome
    clearTimeout(timeoutId);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = { message: text || 'No response data' };
    }

    // Handle unsuccessful responses
    if (!response.ok) {
      throw new ApiError(
        responseData.message || `HTTP error ${response.status}`,
        response.status,
        responseData
      );
    }

    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle different types of errors
    if (error instanceof ApiError) {
      // API errors are already formatted correctly, rethrow
      console.error(`API error (${error.status}):`, error.message);
      throw error;
    } else if (error instanceof Error && error.name === 'AbortError') {
      // Handle timeout
      console.error('Request timed out');
      throw new TimeoutError();
    } else if (!navigator.onLine) {
      // Handle offline status
      console.error('Network connection lost');
      throw new NetworkError('You appear to be offline. Please check your internet connection.');
    } else {
      // Handle other fetch errors (network, CORS, etc.)
      console.error('Network error:', error);
      throw new NetworkError('Failed to connect to the server. Please try again later.');
    }
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