import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useDeleteProduct } from './useProducts';

export function useProductManagement() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);

  const { data: productsData, isLoading, error } = useProducts({ page, limit: 10 });
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

  return {
    products: productsData?.items ?? [],
    isLoading,
    error,
    isEmpty: !isLoading && (productsData?.items.length === 0),
    page,
    setPage,
    showForm,
    openCreate: handleOpenCreate,
    closeForm: handleCloseForm,
    openEdit: handleOpenEdit,
    delete: handleDelete,
    isDeleting: deleteProductMutation.isPending,
    deletingId: deleteProductMutation.variables,
  };
}
