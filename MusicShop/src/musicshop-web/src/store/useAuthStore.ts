import { create } from 'zustand';
import { setAccessToken as setGlobalAccessToken } from '@/shared/api/tokenStore';
import { User } from '@/features/auth/types';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isInitializing: boolean;
  
  // Actions
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setInitializing: (value: boolean) => void;
}

/**
 * Zustand store for reactive authentication state.
 * Syncs the reactive accessToken with the secure non-reactive tokenStore.
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isInitializing: true,

  setAuth: (token: string, user: User) => {
    setGlobalAccessToken(token);
    set({ accessToken: token, user, isInitializing: false });
  },

  clearAuth: () => {
    setGlobalAccessToken(null);
    set({ accessToken: null, user: null, isInitializing: false });
  },

  setInitializing: (value: boolean) => {
    set({ isInitializing: value });
  },
}));
