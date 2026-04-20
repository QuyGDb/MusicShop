import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/features/auth/types';
import { authService } from '@/features/auth/services/authService';
import http from '@/shared/api/axiosInstance';

/**
 * Defines the shape of the authentication context.
 * includes user data, access tokens, and methods to manipulate auth state.
 */
interface AuthContextType {
  accessToken: string | null;

  setAuth: (token: string) => void;
  clearAuth: () => void;
}

// 1. Create the Context object. Default is undefined to enforce Provider usage.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that wraps the application and supplies auth state.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    const token = localStorage.getItem('accessToken');
    return (token === 'undefined' || token === 'null') ? null : token;
  });

  // Update authentication state and persist only the token to local storage
  const setAuth = (newToken: string) => {
    setAccessToken(newToken);
    localStorage.setItem('accessToken', newToken);
  };

  // Clear authentication state and local storage
  const clearAuth = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  };

  // Sync HttpClient unauthorized events with AuthContext
  useEffect(() => {
    http.onUnauthorized = clearAuth;
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
