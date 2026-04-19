import { http } from '@/shared/services/http';
import { ApiResponse, MetaData } from '@/shared/types/api';
import { ProductListItem, ProductFilters } from '../types';

export const productService = {
  /**
   * Retrieves a paginated list of products with optional filters.
   */
  getProducts: async (filters: ProductFilters): Promise<{ items: ProductListItem[]; meta: MetaData | null }> => {
    const response = await http.get<ApiResponse<ProductListItem[]>>('/Products', {
      params: { ...filters }
    });
    
    return {
      items: response.data || [],
      meta: response.meta
    };
  },

  /**
   * Retrieves a single product detail by its slug.
   */
  getProductBySlug: async (slug: string): Promise<unknown> => {
    const response = await http.get<ApiResponse<unknown>>(`/Products/${slug}`);
    return response.data;
  }
};
