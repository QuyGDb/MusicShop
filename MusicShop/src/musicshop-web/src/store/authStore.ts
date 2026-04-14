import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/auth';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        Cookies.set('accessToken', accessToken, { expires: 7 }); // Cookie expires in 7 days
        set({ user, accessToken, isAuthenticated: true });
      },
      
      clearAuth: () => {
        localStorage.removeItem('accessToken');
        Cookies.remove('accessToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
      
      updateUser: (user) => 
        set({ user }),
    }),
    {
      name: 'auth-storage', // Key name stored in LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
