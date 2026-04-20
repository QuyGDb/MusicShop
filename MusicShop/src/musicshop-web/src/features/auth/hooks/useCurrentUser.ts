import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuth } from '@/shared/hooks/useAuth';

export function useCurrentUser() {
  const { accessToken } = useAuth();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe(),
    enabled: !!accessToken,
  });

  return {
    user: user || null,
    isLoading: isLoading && !!accessToken, // Only true if we are actively fetching with a token
    error: error instanceof Error ? error.message : null
  };
}
