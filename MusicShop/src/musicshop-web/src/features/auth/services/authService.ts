import api from '@/services/apiClient';
import { AuthResponse } from '@/types/auth';
import { ApiResponse } from '@/types/api';
import { LoginSchema } from '../schemas/loginSchema';
import { RegisterSchema } from '../schemas/registerSchema';

export const authService = {
  /**
   * Performs standard email/password login
   * @param credentials The email and password from the login form
   * @returns ApiResponse containing AuthResponse (tokens and user info)
   */
  login: async (credentials: LoginSchema): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        // Handle ASP.NET Core ProblemDetails (title/detail)
        const data = error.response.data;
        return {
          success: false,
          data: null,
          error: {
            code: data.title || 'Error.Unknown',
            message: data.detail || 'An unexpected error occurred.'
          },
          meta: null
        };
      }
      return {
        success: false,
        data: null,
        error: {
          code: 'Error.Network',
          message: 'Unable to connect to the server. Please check if the API is running.'
        },
        meta: null
      };
    }
  },

  /**
   * Performs login using Google ID Token
   * @param idToken The ID Token received from Google Identity Services
   * @returns ApiResponse containing AuthResponse (tokens and user info)
   */
  googleLogin: async (idToken: string): Promise<ApiResponse<AuthResponse>> => {
    try {
      // Sending the Google ID Token to the backend for verification and account creation/linking
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/google-login', { idToken });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        // Handle ASP.NET Core ProblemDetails (title/detail)
        const data = error.response.data;
        return {
          success: false,
          data: null,
          error: {
            code: data.title || 'Error.GoogleLogin',
            message: data.detail || 'Google login failed on the server.'
          },
          meta: null
        };
      }
      return {
        success: false,
        data: null,
        error: {
          code: 'Error.Network',
          message: 'Unable to connect to the server for Google login. Please check your connection.'
        },
        meta: null
      };
    }
  },

  /**
   * Performs user registration
   * @param data The registration details (FullName, Email, Password)
   * @returns ApiResponse containing AuthResponse (tokens and user info)
   */
  register: async (data: RegisterSchema): Promise<ApiResponse<AuthResponse>> => {
    try {
      // Backend expects Email, Password, FullName
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
        email: data.email,
        password: data.password,
        fullName: data.fullName
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const problem = error.response.data;
        return {
          success: false,
          data: null,
          error: {
            code: problem.title || 'Error.Registration',
            message: problem.detail || 'Registration failed.'
          },
          meta: null
        };
      }
      return {
        success: false,
        data: null,
        error: {
          code: 'Error.Network',
          message: 'Unable to connect to the server. Please check if the API is running.'
        },
        meta: null
      };
    }
  },
};
