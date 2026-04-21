import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { genreService } from '../services/genreService';
import { toast } from 'sonner';

export function useGenres(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['genres', { page, limit }],
    queryFn: () => genreService.getGenres(page, limit),
  });
}

export function useCreateGenre() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name: string) => genreService.createGenre(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Genre created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create genre');
    }
  });
}

export function useUpdateGenre() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, name }: { id: string, name: string }) => genreService.updateGenre(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Genre updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update genre');
    }
  });
}

export function useDeleteGenre() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => genreService.deleteGenre(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Genre deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete genre');
    }
  });
}
