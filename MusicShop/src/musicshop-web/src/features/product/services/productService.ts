import { http } from '@/shared/services/http';
import { HttpError } from '@/shared/services/HttpError';
import { ApiResponse } from '@/shared/types/api';
import { ProductListItem, ProductFilters } from '../types';

export const productService = {
  /**
   * Retrieves a paginated list of products with optional filters.
   */
  getProducts: async (filters: ProductFilters): Promise<ApiResponse<ProductListItem[]>> => {
    try {
      // Use explicit generic type instead of any
      const data = await http.get<ApiResponse<ProductListItem[]>>('/Products', { 
        params: { ...filters } 
      });
      return data;
    } catch (error) {
      if (error instanceof HttpError) {
        return {
          success: false,
          data: null,
          error: {
            code: 'Product.FetchError',
            message: error.message || 'Could not load products.'
          },
          meta: null
        };
      }
      return {
        success: false,
        data: null,
        error: {
          code: 'Product.UnknownError',
          message: 'An unexpected error occurred.'
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
      // Use unknown instead of any for untyped details
      const data = await http.get<ApiResponse<unknown>>(`/Products/${slug}`);
      return data;
    } catch (error) {
      if (error instanceof HttpError) {
        return {
          success: false,
          data: null,
          error: {
            code: 'Product.NotFound',
            message: error.message || 'Product not found.'
          },
          meta: null
        };
      }
      return {
        success: false,
        data: null,
        error: {
          code: 'Product.UnknownError',
          message: 'An unexpected error occurred.'
        },
        meta: null
      };
    }
  }
};
