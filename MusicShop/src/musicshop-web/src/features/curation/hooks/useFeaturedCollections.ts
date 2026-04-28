import { useQuery } from '@tanstack/react-query';
import { curationService } from '../services/curationService';

export function useFeaturedCollections(count = 3) {
  const featuredQuery = useQuery({
    queryKey: ['featured-collections', count],
    queryFn: () => curationService.getFeaturedCollections(count),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    collections: featuredQuery.data || [],
    isLoading: featuredQuery.isLoading,
    isError: featuredQuery.isError,
  };
}
