import { http } from '@/shared/services/http';
import { ApiResponse } from '@/shared/types/api';
import { AuthResponse, User, LoginRequest, RegisterRequest, ChangePasswordRequest } from '../types';

export const authService = {
  /**
   * POST /auth/login
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await http.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data!;
  },

  /**
   * POST /auth/google-login
   */
  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const response = await http.post<ApiResponse<AuthResponse>>('/auth/google-login', { idToken });
    return response.data!;
  },

  /**
   * POST /auth/register
   */
  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const response = await http.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return response.data!;
  },

  /**
   * POST /auth/refresh — Refreshes the access token using the refresh token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await http.post<ApiResponse<AuthResponse>>('/auth/refresh');
    return response.data!;
  },

  /**
   * GET /auth/me — Returns the currently authenticated user's profile
   */
  getMe: async (): Promise<User> => {
    const response = await http.get<ApiResponse<User>>('/auth/me');
    return response.data!;
  },

  /**
   * POST /auth/logout — Invalidates the refresh token on the server
   */
  logout: async (): Promise<void> => {
    await http.post<ApiResponse<void>>('/auth/logout');
  },

  /**
   * POST /auth/change-password — Changes the authenticated user's password
   */
  changePassword: async (payload: ChangePasswordRequest): Promise<void> => {
    await http.post<ApiResponse<void>>('/auth/change-password', payload);
  },
};
