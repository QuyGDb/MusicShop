import { useQuery } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { useAuthStore } from '@/store/useAuthStore';

export function useCart() {
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);

  const { data: cart, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated,
    retry: 1,
  });

  return {
    cart,
    isLoading,
    error: error instanceof Error ? error.message : null,
    isEmpty: !cart || cart.items.length === 0,
  };
}
