import api, { ApiError } from '@/shared/services/apiClient';
import { ApiResponse } from '@/shared/types/api';
import { ProductListItem, ProductFilters } from '../types';

export const productService = {
  /**
   * Retrieves a paginated list of products with optional filters.
   */
  getProducts: async (filters: ProductFilters): Promise<ApiResponse<ProductListItem[]>> => {
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.format !== undefined) params.append('format', filters.format.toString());
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.artistId) params.append('artistId', filters.artistId);
      if (filters.isLimited !== undefined) params.append('isLimited', filters.isLimited.toString());
      if (filters.isPreorder !== undefined) params.append('isPreorder', filters.isPreorder.toString());
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.searchQuery) params.append('searchQuery', filters.searchQuery);

      const response = await api.get<ApiResponse<ProductListItem[]>>(`/Products?${params.toString()}`);
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error: {
          code: 'Product.FetchError',
          message: 'Could not load products. Please try again.'
        },
        meta: null
      };
    }
  },

  /**
   * Retrieves a single product detail by its slug.
   */
  getProductBySlug: async (slug: string): Promise<ApiResponse<unknown>> => {
    try {
      const response = await api.get<ApiResponse<unknown>>(`/Products/${slug}`);
      return response.data;
    } catch (error: unknown) {
      return {
        success: false,
        data: null,
        error: {
          code: 'Product.NotFound',
          message: 'Product not found.'
        },
        meta: null
      };
    }
  }
};

