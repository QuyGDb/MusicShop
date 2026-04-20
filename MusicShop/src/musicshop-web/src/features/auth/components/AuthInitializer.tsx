import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/features/auth/services/authService';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Headless component that initializes authentication on app load.
 * Performs a silent refresh to retrieve an access token if a refresh session exists.
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
  const { setAuth, clearAuth, setInitializing } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Attempt to refresh token using HttpOnly cookie
        const response = await authService.refreshToken();
        if (response?.accessToken) {
          setAuth(response.accessToken);
        } else {
          clearAuth();
        }
      } catch (_error) {
        // Refresh failed (no session or expired)
        clearAuth();
      } finally {
        setInitializing(false);
      }
    };

    initAuth();
  }, [setAuth, clearAuth, setInitializing]);

  return <>{children}</>;
}
