import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminProduct, useDeleteProductVariant } from './useProducts';
import { ProductVariant } from '../types';

interface UseProductAdminDetailsProps {
  productId: string;
}

export function useProductAdminDetails({ productId }: UseProductAdminDetailsProps) {
  const navigate = useNavigate();
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);

  const { data: product, isLoading, error } = useAdminProduct(productId);
  const deleteVariantMutation = useDeleteProductVariant(productId);

  const handleOpenAddVariant = () => {
    setEditingVariant(null);
    setShowVariantModal(true);
  };

  const handleOpenEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setShowVariantModal(true);
  };

  const handleCloseVariantModal = () => {
    setShowVariantModal(false);
    setEditingVariant(null);
  };

  const handleDeleteVariant = (variantId: string) => {
    if (window.confirm('Delete this variant?')) {
      deleteVariantMutation.mutate(variantId);
    }
  };

  const handleBack = () => {
    navigate('/admin/products');
  };

  const handleViewStore = () => {
    if (product) {
      window.open(`/products/${product.id}`, '_blank');
    }
  };

  return {
    product,
    isLoading,
    error,
    variantModal: {
      isOpen: showVariantModal,
      editingVariant,
      openAdd: handleOpenAddVariant,
      openEdit: handleOpenEditVariant,
      close: handleCloseVariantModal,
    },
    actions: {
      deleteVariant: handleDeleteVariant,
      isDeletingVariant: deleteVariantMutation.isPending,
      deletingVariantId: deleteVariantMutation.variables,
      back: handleBack,
      viewStore: handleViewStore,
    }
  };
}
