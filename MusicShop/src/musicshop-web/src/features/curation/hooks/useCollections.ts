import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { curationService } from '../services/curationService';

export function useCollections() {
  const queryClient = useQueryClient();

  const collectionsQuery = useQuery({
    queryKey: ['curated-collections'],
    queryFn: () => curationService.getCollections(true),
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      curationService.updateCollection(id, { isPublished }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curated-collections'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: curationService.deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curated-collections'] });
    },
  });

  return {
    collections: collectionsQuery.data || [],
    isLoading: collectionsQuery.isLoading,
    isError: collectionsQuery.isError,
    togglePublish: (id: string, currentStatus: boolean) => 
      togglePublishMutation.mutate({ id, isPublished: !currentStatus }),
    deleteCollection: (id: string) => deleteMutation.mutate(id),
  };
}
