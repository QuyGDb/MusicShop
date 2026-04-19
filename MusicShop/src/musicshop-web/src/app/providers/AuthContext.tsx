import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/features/auth/types';
import { authService } from '@/features/auth/services/authService';

/**
 * Defines the shape of the authentication context.
 * includes user data, access tokens, and methods to manipulate auth state.
 */
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

// 1. Create the Context object. Default is undefined to enforce Provider usage.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that wraps the application and supplies auth state.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    const token = localStorage.getItem('accessToken');
    return (token === 'undefined' || token === 'null') ? null : token;
  });

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    
    // Check for invalid or empty values before parsing
    if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Failed to parse user from local storage:', error);
      localStorage.removeItem('user');
      return null;
    }
  });

  // Verify session on startup
  useEffect(() => {
    const initAuth = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await authService.getMe();
        if (result.success) {
          setUser(result.data);
          // If we have a user but no stored user data, sync it
          localStorage.setItem('user', JSON.stringify(result.data));
        } else if (result.error.status === 401) {
          // Token expired and refresh failed (handled by HttpClient silently if possible)
          // If we still get 401 here, it means even refresh failed
          clearAuth();
        }
      } catch (error) {
        console.error('Session verification failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [accessToken]);

  // Update authentication state and persist to local storage
  const setAuth = (newUser: User, newToken: string) => {
    // Only persist if we have valid data
    if (newUser && newToken) {
      setUser(newUser);
      setAccessToken(newToken);
      localStorage.setItem('accessToken', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      console.warn('setAuth called with invalid data:', { newUser, newToken });
    }
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
    <AuthContext.Provider value={{ user, accessToken, isLoading, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
