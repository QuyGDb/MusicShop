import { useNavigate } from 'react-router-dom';
import { useAdminProduct } from './useProducts';

interface UseProductAdminDetailsProps {
  productId: string;
}

export function useProductAdminDetails({ productId }: UseProductAdminDetailsProps) {
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useAdminProduct(productId);

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
    actions: {
      back: handleBack,
      viewStore: handleViewStore,
    }
  };
}
