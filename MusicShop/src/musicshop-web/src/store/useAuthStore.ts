import { create } from 'zustand';
import { setAccessToken as setGlobalAccessToken } from '@/shared/api/tokenStore';

interface AuthState {
  accessToken: string | null;
  isInitializing: boolean;
  
  // Actions
  setAuth: (token: string) => void;
  clearAuth: () => void;
  setInitializing: (value: boolean) => void;
}

/**
 * Zustand store for reactive authentication state.
 * Syncs the reactive accessToken with the secure non-reactive tokenStore.
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isInitializing: true,

  setAuth: (token: string) => {
    setGlobalAccessToken(token);
    set({ accessToken: token, isInitializing: false });
  },

  clearAuth: () => {
    setGlobalAccessToken(null);
    set({ accessToken: null, isInitializing: false });
  },

  setInitializing: (value: boolean) => {
    set({ isInitializing: value });
  },
}));
