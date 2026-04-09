import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/auth';

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
        set({ user, accessToken, isAuthenticated: true });
      },
      
      clearAuth: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
      
      updateUser: (user) => 
        set({ user }),
    }),
    {
      name: 'auth-storage', // Tên key lưu trong LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
