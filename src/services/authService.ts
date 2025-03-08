const AUTH_TOKEN_KEY = 'calorieTracker_authToken';
const USER_DATA_KEY = 'calorieTracker_userData';

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Mock user database
const MOCK_USERS = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'password123'
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: 'test123'
  }
];

// Store token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

// Get token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Remove token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// Store user data in localStorage
export const setUserData = (user: User): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

// Get user data from localStorage
export const getUserData = (): User | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Login function
export const login = (username: string, password: string): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    // Simulate API request delay
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // Generate mock token
        const token = `mock-jwt-token-${Math.random().toString(36).substring(2)}`;
        const { password, ...userWithoutPassword } = user;
        
        // Store auth data
        setAuthToken(token);
        setUserData(userWithoutPassword as User);
        
        resolve({
          success: true,
          message: 'Login successful',
          user: userWithoutPassword as User,
          token
        });
      } else {
        resolve({
          success: false,
          message: 'Invalid username or password'
        });
      }
    }, 500); // Simulate network delay
  });
};

// Logout function
export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    removeAuthToken();
    resolve();
  });
};

// Register function (for future implementation)
export const register = (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    // Simulate API request delay
    setTimeout(() => {
      // Check if username or email already exists
      const userExists = MOCK_USERS.some(
        (u) => u.username === username || u.email === email
      );

      if (userExists) {
        resolve({
          success: false,
          message: 'Username or email already exists'
        });
      } else {
        // In a real app, you would add the user to the database
        // Here we're just simulating a successful registration
        resolve({
          success: true,
          message: 'Registration successful. Please log in.'
        });
      }
    }, 500);
  });
};