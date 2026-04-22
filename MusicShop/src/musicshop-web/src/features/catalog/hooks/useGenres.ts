import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { genreService, CreateGenreRequest, UpdateGenreRequest } from '../services/genreService';
import { toast } from 'sonner';

export function useGenres(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['genres', { page, limit }],
    queryFn: () => genreService.getGenres(page, limit),
  });
}

export function useCreateGenre() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateGenreRequest) => genreService.createGenre(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Genre created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create genre');
    }
  });
}

export function useUpdateGenre() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateGenreRequest }) => 
      genreService.updateGenre(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      toast.success('Genre updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update genre');
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
      toast.error(error.message || 'Failed to delete genre');
    }
  });
}
