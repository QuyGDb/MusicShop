import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts, useDeleteProduct } from './useProducts';

export function useProductManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const [showForm, setShowForm] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync debounced search to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('q', debouncedSearch);
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  }, [debouncedSearch]);

  const { data: productsData, isLoading, error } = useProducts({ 
    page, 
    limit: 10,
    searchQuery: debouncedSearch || undefined 
  });

  const deleteProductMutation = useDeleteProduct();

  const handleOpenCreate = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleOpenEdit = (id: string) => {
    navigate(`/admin/products/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This will unlist it from the store.')) {
      deleteProductMutation.mutate(id);
    }
  };

  const setPage = (pageNum: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());
    setSearchParams(params);
  };

  return {
    products: productsData?.items ?? [],
    isLoading,
    error,
    isEmpty: !isLoading && (productsData?.items.length === 0),
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    totalPages: productsData?.meta ? Math.ceil(productsData.meta.total / 10) : 1,
    meta: productsData?.meta,
    showForm,
    openCreate: handleOpenCreate,
    closeForm: handleCloseForm,
    openEdit: handleOpenEdit,
    delete: handleDelete,
    isDeleting: deleteProductMutation.isPending,
    deletingId: deleteProductMutation.variables,
  };
}
