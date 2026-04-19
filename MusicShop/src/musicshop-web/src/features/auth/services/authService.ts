import { http } from '@/shared/services/http';
import { HttpError } from '@/shared/services/HttpError';
import { ApiResponse } from '@/shared/types/api';
import { AuthResponse, User, LoginRequest, RegisterRequest, ChangePasswordRequest } from '../types';

type AuthResult = { success: true; data: AuthResponse } | { success: false; error: { message: string; status?: number } };
type SimpleResult = { success: true } | { success: false; error: { message: string; status?: number } };

function handleHttpError(error: unknown): { success: false; error: { message: string; status?: number } } {
  if (error instanceof HttpError) {
    return { success: false, error: { message: error.message, status: error.status } };
  }
  return { success: false, error: { message: 'An unexpected error occurred.' } };
}

export const authService = {
  /**
   * POST /auth/login
   */
  login: async (credentials: LoginRequest): Promise<AuthResult> => {
    try {
      const response = await http.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return { success: true, data: response.data! };
    } catch (error) {
      return handleHttpError(error);
    }
  },

  /**
   * POST /auth/google-login
   */
  googleLogin: async (idToken: string): Promise<AuthResult> => {
    try {
      const response = await http.post<ApiResponse<AuthResponse>>('/auth/google-login', { idToken });
      return { success: true, data: response.data! };
    } catch (error) {
      return handleHttpError(error);
    }
  },

  /**
   * POST /auth/register
   */
  register: async (payload: RegisterRequest): Promise<AuthResult> => {
    try {
      const response = await http.post<ApiResponse<AuthResponse>>('/auth/register', payload);
      return { success: true, data: response.data! };
    } catch (error) {
      return handleHttpError(error);
    }
  },

  /**
   * POST /auth/refresh — Refreshes the access token using the refresh token
   */
  refreshToken: async (): Promise<AuthResult> => {
    try {
      const response = await http.post<ApiResponse<AuthResponse>>('/auth/refresh');
      return { success: true, data: response.data! };
    } catch (error) {
      return handleHttpError(error);
    }
  },

  /**
   * GET /auth/me — Returns the currently authenticated user's profile
   */
  getMe: async (): Promise<{ success: true; data: User } | { success: false; error: { message: string; status?: number } }> => {
    try {
      const response = await http.get<ApiResponse<User>>('/auth/me');
      return { success: true, data: response.data! };
    } catch (error) {
      return handleHttpError(error);
    }
  },

  /**
   * POST /auth/logout — Invalidates the refresh token on the server
   */
  logout: async (): Promise<SimpleResult> => {
    try {
      await http.post<ApiResponse<void>>('/auth/logout');
      return { success: true };
    } catch (error) {
      return handleHttpError(error);
    }
  },

  /**
   * POST /auth/change-password — Changes the authenticated user's password
   */
  changePassword: async (payload: ChangePasswordRequest): Promise<SimpleResult> => {
    try {
      await http.post<ApiResponse<void>>('/auth/change-password', payload);
      return { success: true };
    } catch (error) {
      return handleHttpError(error);
    }
  },
};
