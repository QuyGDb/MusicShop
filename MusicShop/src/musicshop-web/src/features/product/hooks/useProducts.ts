import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { ProductFilters, ReleaseFormat } from '../types';
import { useProductFilters } from './useProductFilters';

export function useProducts() {
  const { 
    selectedFormat, 
    selectedGenre, 
    minPrice, 
    maxPrice, 
    page, 
    searchQuery 
  } = useProductFilters();

  const filters: ProductFilters = {
    format: selectedFormat ? parseInt(selectedFormat) as ReleaseFormat : undefined,
    genre: selectedGenre || undefined,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    page: page,
    limit: 12,
    searchQuery: searchQuery || undefined
  };

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
  });

  const products = data?.items || [];
  const totalItems = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / 12);

  return {
    products,
    loading,
    error: error instanceof Error ? error.message : null,
    totalItems,
    totalPages,
    currentPage: page
  };
}
