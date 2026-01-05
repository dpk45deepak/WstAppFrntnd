// src/context/AuthContext.tsx
import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import authService from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: 'wstapp_token',
  USER: 'wstapp_user',
  EXPIRY: 'wstapp_expiry',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveAuthData = useCallback((newToken: string, newUser: User) => {
    // Store token and user data
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    
    // Set expiry (30 days from now)
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    localStorage.setItem(STORAGE_KEYS.EXPIRY, expiry.toISOString());
    
    setToken(newToken);
    setUser(newUser);
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.EXPIRY);
    setToken(null);
    setUser(null);
  }, []);

  const checkTokenExpiry = useCallback(() => {
    const expiry = localStorage.getItem(STORAGE_KEYS.EXPIRY);
    if (!expiry) return false;
    
    const expiryDate = new Date(expiry);
    const now = new Date();
    return now < expiryDate;
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const updatedUser = await authService.getProfile();
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      
      if (storedToken && storedUser && checkTokenExpiry()) {
        try {
          // Verify token is still valid
          await authService.getProfile();
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // Token is invalid, clear storage
          clearAuthData();
        }
      } else if (storedToken && (!storedUser || !checkTokenExpiry())) {
        // Clear expired or incomplete auth data
        clearAuthData();
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, [clearAuthData, checkTokenExpiry]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { token, user } = await authService.login(email, password);
      saveAuthData(token, user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    try {
      const { token, user } = await authService.register(name, email, password, role);
      saveAuthData(token, user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    authService.logout();
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
    // Update stored user data
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ ...userData, ...updates }));
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    refreshProfile,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };