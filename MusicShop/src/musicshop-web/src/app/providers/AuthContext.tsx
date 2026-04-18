import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/features/auth/types';

/**
 * Defines the shape of the authentication context.
 * includes user data, access tokens, and methods to manipulate auth state.
 */
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

// 1. Create the Context object. Default is undefined to enforce Provider usage.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that wraps the application and supplies auth state.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('accessToken');
  });

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Failed to parse user from local storage:', error);
        localStorage.removeItem('user');
      }
    }
    return null;
  });

  // Update authentication state and persist to local storage
  const setAuth = (newUser: User, newToken: string) => {
    setUser(newUser);
    setAccessToken(newToken);
    localStorage.setItem('accessToken', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Clear authentication state and local storage
  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  return (
    // Provide the combined state and actions to the rest of the app
    <AuthContext.Provider value={{ user, accessToken, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
