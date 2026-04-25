import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { artistService, CreateArtistRequest, UpdateArtistRequest } from '../services/artistService';
import { toast } from 'sonner';

export function useArtists(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['artists', { page, limit }],
    queryFn: () => artistService.getArtists(page, limit),
  });
}

export function useArtist(slug: string) {
  return useQuery({
    queryKey: ['artists', slug],
    queryFn: () => artistService.getArtistBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateArtist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateArtistRequest) => artistService.createArtist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create artist');
    }
  });
}

export function useUpdateArtist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateArtistRequest }) => 
      artistService.updateArtist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update artist');
    }
  });
}

export function useDeleteArtist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => artistService.deleteArtist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      toast.success('Artist deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete artist');
    }
  });
}
