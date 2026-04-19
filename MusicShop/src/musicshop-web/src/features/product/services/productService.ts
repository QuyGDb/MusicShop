import { http } from '@/shared/services/http';
import { HttpError } from '@/shared/services/HttpError';
import { ApiResponse, MetaData } from '@/shared/types/api';
import { ProductListItem, ProductFilters } from '../types';

type ProductListResult =
  | { success: true; data: ProductListItem[]; meta: MetaData | null }
  | { success: false; error: { code: string; message: string } };

type ProductDetailResult =
  | { success: true; data: unknown }
  | { success: false; error: { code: string; message: string } };

export const productService = {
  /**
   * Retrieves a paginated list of products with optional filters.
   */
  getProducts: async (filters: ProductFilters): Promise<ProductListResult> => {
    try {
      const response = await http.get<ApiResponse<ProductListItem[]>>('/Products', {
        params: { ...filters }
      });
      return { 
        success: true, 
        data: response.data || [], 
        meta: response.meta 
      };
    } catch (error) {
      if (error instanceof HttpError) {
        return {
          success: false,
          error: {
            code: 'Product.FetchError',
            message: error.message || 'Could not load products.'
          }
        };
      }
      return {
        success: false,
        error: {
          code: 'Product.UnknownError',
          message: 'An unexpected error occurred.'
        }
      };
    }
  },

  /**
   * Retrieves a single product detail by its slug.
   */
  getProductBySlug: async (slug: string): Promise<ProductDetailResult> => {
    try {
      const response = await http.get<ApiResponse<unknown>>(`/Products/${slug}`);
      return { success: true, data: response.data };
    } catch (error) {
      if (error instanceof HttpError) {
        return {
          success: false,
          error: {
            code: 'Product.NotFound',
            message: error.message || 'Product not found.'
          }
        };
      }
      return {
        success: false,
        error: {
          code: 'Product.UnknownError',
          message: 'An unexpected error occurred.'
        }
      };
    }
  }
};
