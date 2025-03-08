import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  isAuthenticated as checkAuth, 
  getUserData, 
  login as authLogin, 
  logout as authLogout
} from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthentication = () => {
      const authenticated = checkAuth();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUser(getUserData());
      }
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authLogin(username, password);
      if (response.success && response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
      }
      setLoading(false);
      return { success: response.success, message: response.message };
    } catch (error) {
      setLoading(false);
      return { success: false, message: 'An error occurred during login.' };
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authLogout();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;