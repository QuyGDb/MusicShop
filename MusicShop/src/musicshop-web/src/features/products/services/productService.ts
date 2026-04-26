import http from '@/shared/api/axiosInstance';
import { ApiResponse, PaginatedResponse } from '@/shared/types/api';
import { Product, ProductDetail } from '../types';

export interface ProductFilters {
  format?: string;
  genre?: string;
  artistId?: string;
  isLimited?: boolean;
  isPreorder?: boolean;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export const productService = {
  getProducts: async (filters: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const { page, limit, ...restFilters } = filters;
    const response = await http.get<ApiResponse<Product[]>>('/Products', {
      params: { 
        ...restFilters,
        PageNumber: page,
        PageSize: limit
      }
    });
    
    return {
      items: response.data || [],
      meta: response.meta
    };
  },

  getProductBySlug: async (slug: string): Promise<ProductDetail> => {
    const response = await http.get<ApiResponse<ProductDetail>>(`/Products/${slug}`);
    if (!response.data) throw new Error('Product not found');
    return response.data;
  },

  getProductById: async (id: string): Promise<ProductDetail> => {
    const response = await http.get<ApiResponse<ProductDetail>>(`/Products/admin/${id}`);
    if (!response.data) throw new Error('Product not found');
    return response.data;
  },

  // Admin specific operations
  createProduct: async (data: unknown): Promise<string> => {
    const response = await http.post<ApiResponse<string>>('/Products', data);
    return response.data || '';
  },

  updateProduct: async (id: string, data: unknown): Promise<void> => {
    await http.put(`/Products/${id}`, data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    await http.delete(`/Products/${id}`);
  },

};
