import api from '@/services/apiClient';
import { AuthResponse } from '@/types/auth';
import { ApiResponse } from '@/types/api';
import { LoginSchema } from '../schemas/loginSchema';

export const authService = {
  login: async (credentials: LoginSchema): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        data: null,
        error: {
          code: 'Error.Unknown',
          message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
        },
        meta: null
      };
    }
  },
};
