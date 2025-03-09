import { getAuthToken } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';

// Cache configuration
interface CacheConfig {
  enabled: boolean;
  maxAge: number; // in milliseconds
  maxSize: number; // maximum number of cached items
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheMap {
  [key: string]: CacheEntry<any>;
}

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

// Cache implementation
class ApiCache {
  private cache: CacheMap = {};
  private keyOrder: string[] = [];
  private config: CacheConfig = {
    enabled: true,
    maxAge: 5 * 60 * 1000, // 5 minutes default
    maxSize: 100 // Maximum 100 items in cache
  };

  constructor(config?: Partial<CacheConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  get<T>(key: string): T | null {
    if (!this.config.enabled) return null;
    
    const entry = this.cache[key];
    
    if (!entry) return null;
    
    const now = Date.now();
    
    // Check if the entry is expired
    if (now - entry.timestamp > this.config.maxAge) {
      this.delete(key);
      return null;
    }
    
    // Return cached data
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    if (!this.config.enabled) return;
    
    // Add to cache
    this.cache[key] = {
      data,
      timestamp: Date.now()
    };
    
    // Update key order for LRU functionality
    this.keyOrder = this.keyOrder.filter(k => k !== key);
    this.keyOrder.push(key);
    
    // Check if we need to evict items (LRU eviction policy)
    this.evictIfNeeded();
  }

  delete(key: string): void {
    delete this.cache[key];
    this.keyOrder = this.keyOrder.filter(k => k !== key);
  }

  clear(): void {
    this.cache = {};
    this.keyOrder = [];
  }

  private evictIfNeeded(): void {
    while (this.keyOrder.length > this.config.maxSize) {
      const oldestKey = this.keyOrder.shift();
      if (oldestKey) {
        delete this.cache[oldestKey];
      }
    }
  }
  
  // Invalidate cache entries that match a specific pattern
  invalidatePattern(pattern: RegExp): void {
    const keysToInvalidate = Object.keys(this.cache).filter(key => 
      pattern.test(key)
    );
    
    keysToInvalidate.forEach(key => this.delete(key));
  }
}

// Create an instance of the cache
export const apiCache = new ApiCache();

// Enum for cache strategies
export enum CacheStrategy {
  NetworkOnly = 'network-only',      // Always fetch from network
  CacheFirst = 'cache-first',        // Try cache first, then network
  NetworkFirstWithRefresh = 'network-first-with-refresh', // Try network, fallback to cache, but still refresh cache
  StaleWhileRevalidate = 'stale-while-revalidate' // Return cache immediately and refresh in background
}

// Interface for request options
interface RequestOptions {
  timeout?: number;
  cacheStrategy?: CacheStrategy;
  cacheTTL?: number; // Custom TTL in milliseconds for this specific request
  cacheKey?: string; // Custom cache key, useful for requests with the same URL but different meaning
}

// Generic function to make API requests with improved error handling and caching
const makeRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  options: RequestOptions = {}
): Promise<T> => {
  // Default options
  const {
    timeout = 30000, // 30 seconds timeout
    cacheStrategy = method === 'GET' ? CacheStrategy.CacheFirst : CacheStrategy.NetworkOnly,
    cacheTTL,
    cacheKey
  } = options;

  // Create a cache key based on the endpoint, method, and body data
  const generateCacheKey = () => {
    if (cacheKey) return cacheKey;
    
    const bodyStr = data ? JSON.stringify(data) : '';
    return `${method}:${endpoint}:${bodyStr}`;
  };

  const actualCacheKey = generateCacheKey();
  
  // Check if we can return data from cache based on strategy
  if (method === 'GET' && (cacheStrategy === CacheStrategy.CacheFirst || cacheStrategy === CacheStrategy.StaleWhileRevalidate)) {
    const cachedData = apiCache.get<T>(actualCacheKey);
    if (cachedData !== null) {
      // If using stale-while-revalidate, trigger a refresh in the background
      if (cacheStrategy === CacheStrategy.StaleWhileRevalidate) {
        // Execute network request in the background to update the cache
        fetchFromNetwork().then(freshData => {
          apiCache.set(actualCacheKey, freshData);
        }).catch(error => {
          console.error('Background cache refresh failed:', error);
        });
      }
      
      // Return cached data immediately
      return cachedData;
    }
  }

  // If we reach here, we need to execute a network request
  try {
    const responseData = await fetchFromNetwork();
    
    // Only cache GET requests
    if (method === 'GET') {
      apiCache.set(actualCacheKey, responseData);
    } 
    // For data-modifying operations, invalidate relevant caches
    else if (endpoint.startsWith('/food-entries')) {
      apiCache.invalidatePattern(/^GET:\/food-entries/);
    }
    
    return responseData;
  } catch (error) {
    // For network-first with refresh, try the cache as fallback
    if (method === 'GET' && cacheStrategy === CacheStrategy.NetworkFirstWithRefresh) {
      const cachedData = apiCache.get<T>(actualCacheKey);
      if (cachedData !== null) {
        console.log('Network request failed, using cached data');
        return cachedData;
      }
    }
    
    // No cache fallback available, throw the error
    throw error;
  }
  
  // Internal function to perform the actual network request
  async function fetchFromNetwork(): Promise<T> {
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
  }
};

// Food Entry API Calls
export const fetchFoodEntries = async (startDate?: string, endDate?: string) => {
  let queryParams = '';
  if (startDate && endDate) {
    queryParams = `?startDate=${startDate}&endDate=${endDate}`;
  }
  
  // Use stale-while-revalidate for a better user experience
  return makeRequest(`/food-entries${queryParams}`, 'GET', undefined, {
    cacheStrategy: CacheStrategy.StaleWhileRevalidate,
    // Generate a consistent cache key for this query
    cacheKey: `GET:/food-entries:range:${startDate || 'all'}-${endDate || 'all'}`
  });
};

export const fetchFoodEntriesByDate = async (date: string) => {
  // Use cache-first for date-specific data which doesn't change often
  return makeRequest(`/food-entries/date/${date}`, 'GET', undefined, {
    cacheStrategy: CacheStrategy.CacheFirst,
    // Custom cache key for date-specific entries
    cacheKey: `GET:/food-entries/date/${date}`
  });
};

export const createFoodEntry = async (entry: {
  name: string;
  calories: number;
  mealType: string;
  timestamp: string;
}) => {
  // Don't cache POST requests
  const result = await makeRequest('/food-entries', 'POST', entry);
  
  // After creating an entry, clear all food entries caches
  apiCache.invalidatePattern(/^GET:\/food-entries/);
  
  return result;
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
  // Don't cache PUT requests
  const result = await makeRequest(`/food-entries/${id}`, 'PUT', entry);
  
  // After updating an entry, clear all food entries caches
  apiCache.invalidatePattern(/^GET:\/food-entries/);
  
  return result;
};

export const deleteFoodEntry = async (id: string) => {
  // Don't cache DELETE requests
  const result = await makeRequest(`/food-entries/${id}`, 'DELETE');
  
  // After deleting an entry, clear all food entries caches
  apiCache.invalidatePattern(/^GET:\/food-entries/);
  
  return result;
};

export const fetchFoodSummary = async (startDate: string, endDate: string) => {
  // Use stale-while-revalidate for summary data
  return makeRequest(
    `/food-entries/summary?startDate=${startDate}&endDate=${endDate}`,
    'GET',
    undefined,
    {
      cacheStrategy: CacheStrategy.StaleWhileRevalidate,
      // Custom cache key for summary data
      cacheKey: `GET:/food-entries/summary:${startDate}-${endDate}`
    }
  );
};

// User API Calls
export const updateUserProfile = async (data: { dailyCalorieGoal?: number }) => {
  // Don't cache PUT requests
  return makeRequest('/auth/profile', 'PUT', data);
};

// Cache control functions
export const clearApiCache = () => {
  apiCache.clear();
};

export const invalidateFoodEntriesCache = () => {
  apiCache.invalidatePattern(/^GET:\/food-entries/);
};

export default {
  fetchFoodEntries,
  fetchFoodEntriesByDate,
  createFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
  fetchFoodSummary,
  updateUserProfile,
  clearApiCache,
  invalidateFoodEntriesCache
};