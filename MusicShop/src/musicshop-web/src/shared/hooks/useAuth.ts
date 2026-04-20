import { useAuthStore } from '@/store/useAuthStore';

/**
 * Custom hook to access reactive authentication state and actions.
 */
export function useAuth() {
  const { accessToken, setAuth, clearAuth, isInitializing } = useAuthStore();
  
  return {
    accessToken,
    setAuth,
    clearAuth,
    isInitializing,
    isAuthenticated: !!accessToken,
  };
}

