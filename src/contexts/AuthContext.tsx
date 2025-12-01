/**
 * Authentication Context
 * Provides global auth state and methods
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, login as apiLogin, register as apiRegister, logout as apiLogout } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await apiLogin({ email, password });
      setUser(result.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const result = await apiRegister({ email, password, name });
      setUser(result.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const refreshUser = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setUser(null);
      return;
    }

    try {
      // Fetch fresh user data from backend
      const API_BASE = import.meta.env.DEV
        ? 'http://localhost:8888/api'
        : '/api';

      const response = await fetch(`${API_BASE}/user-stats?user_id=${currentUser.id}`);

      if (!response.ok) {
        console.error('Failed to refresh user data');
        return;
      }

      const data = await response.json();

      // Update user data with fresh stats
      const updatedUser = {
        ...currentUser,
        stats: data.stats,
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update state
      setUser(updatedUser);

      console.log('✅ User data refreshed:', updatedUser.stats);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
