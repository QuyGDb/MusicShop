import http from '@/shared/api/axiosInstance';
import { ApiResponse } from '@/shared/types/api';
import { CreateOrderRequest, CreateOrderResponse } from '../types';

export const checkoutService = {
  createOrder: async (request: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await http.post<ApiResponse<CreateOrderResponse>>('/Orders', request);
    return response.data;
  },
};
