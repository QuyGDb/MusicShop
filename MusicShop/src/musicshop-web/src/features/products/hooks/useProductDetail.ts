import { useNavigate } from 'react-router-dom';
import { useProduct } from './useProducts';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartMutations } from '@/features/cart/hooks/useCartMutations';
import { useCartUIStore } from '@/features/cart/store/useCartUIStore';

interface UseProductDetailProps {
  slug: string;
}

interface UseProductDetailReturn {
  product: ReturnType<typeof useProduct>['data'];
  isLoading: boolean;
  error: string | null;
  handleBack: () => void;
  handleAddToCart: () => void;
  isAddingToCart: boolean;
}

export function useProductDetail({ slug }: UseProductDetailProps): UseProductDetailReturn {
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(slug);
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);
  const { addToCart } = useCartMutations();
  const openCart = useCartUIStore((state) => state.openCart);

  const handleBack = () => {
    navigate('/products');
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (product) {
      addToCart.mutate({ productId: product.id, quantity: 1 }, {
        onSuccess: () => {
          openCart();
        }
      });
    }
  };

  return {
    product,
    isLoading,
    error: error instanceof Error ? error.message : null,
    handleBack,
    handleAddToCart,
    isAddingToCart: addToCart.isPending,
  };
}
