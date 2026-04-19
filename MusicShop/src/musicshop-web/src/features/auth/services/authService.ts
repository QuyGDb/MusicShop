import { http } from '@/shared/services/http';
import { HttpError } from '@/shared/services/HttpError';
import { AuthResponse } from '../types';

export const authService = {
  /**
   * Performs standard email/password login
   */
  login: async (credentials: { email: string; password: string }) => {
    try {
      const data = await http.post<AuthResponse>('/auth/login', credentials);
      return { success: true, data };
    } catch (error) {
      if (error instanceof HttpError) {
        return { 
          success: false, 
          error: { message: error.message, status: error.status } 
        };
      }
      return { success: false, error: { message: 'Unexpected error' } };
    }
  },

  /**
   * Performs login using Google ID Token
   */
  googleLogin: async (idToken: string) => {
    try {
      const data = await http.post<AuthResponse>('/auth/google-login', { idToken });
      return { success: true, data };
    } catch (error) {
      if (error instanceof HttpError) {
        return { 
          success: false, 
          error: { message: error.message, status: error.status } 
        };
      }
      return { success: false, error: { message: 'Unexpected error' } };
    }
  },

  /**
   * Performs user registration
   */
  register: async (payload: { email: string; password: string; fullName: string }) => {
    try {
      const data = await http.post<AuthResponse>('/auth/register', payload);
      return { success: true, data };
    } catch (error) {
      if (error instanceof HttpError) {
        return { 
          success: false, 
          error: { message: error.message, status: error.status } 
        };
      }
      return { success: false, error: { message: 'Unexpected error' } };
    }
  },

  /**
   * Performs logout
   */
  logout: () => http.post('/auth/logout'),
};
