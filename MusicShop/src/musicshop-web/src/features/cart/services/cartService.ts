import http from '@/shared/api/axiosInstance';
import { ApiResponse } from '@/shared/types/api';
import { Cart, AddToCartRequest, UpdateCartItemRequest } from '../types';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await http.get<ApiResponse<Cart>>('/Cart');
    // If the cart doesn't exist yet, backend might return 404 or empty cart.
    // Ensure we handle it gracefully if it throws, but generally we rely on the interceptor.
    if (!response.data) throw new Error('Cart not found');
    return response.data;
  },

  addToCart: async (request: AddToCartRequest): Promise<string> => {
    const response = await http.post<ApiResponse<string>>('/Cart/items', request);
    return response.data;
  },

  updateCartItem: async (id: string, request: UpdateCartItemRequest): Promise<void> => {
    await http.put(`/Cart/items/${id}`, request);
  },

  removeFromCart: async (id: string): Promise<void> => {
    await http.delete(`/Cart/items/${id}`);
  },

  clearCart: async (): Promise<void> => {
    await http.delete('/Cart');
  },
};
