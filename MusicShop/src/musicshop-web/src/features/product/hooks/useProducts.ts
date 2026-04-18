import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { ProductFilters, ReleaseFormat, ProductListItem } from '../types';
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

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const filters: ProductFilters = {
        format: selectedFormat ? parseInt(selectedFormat) as ReleaseFormat : undefined,
        genre: selectedGenre || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        page: page,
        limit: 12,
        searchQuery: searchQuery || undefined
      };

      try {
        const result = await productService.getProducts(filters);
        
        if (result.success) {
          setProducts(result.data || []);
          setTotalItems(result.meta?.total || 0);
        } else {
          setError(result.error?.message || 'Failed to load products');
        }
      } catch (err) {
        setError('A network error occurred while fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedFormat, selectedGenre, minPrice, maxPrice, page, searchQuery]);

  const totalPages = Math.ceil(totalItems / 12);

  return {
    products,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage: page
  };
}
