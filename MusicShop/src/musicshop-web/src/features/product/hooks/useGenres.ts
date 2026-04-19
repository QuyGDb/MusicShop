import { useQuery } from '@tanstack/react-query';
import { genreService } from '../services/genreService';

export function useGenres() {
  const { data: genres = [], isLoading: loading, error } = useQuery({
    queryKey: ['genres'],
    queryFn: () => genreService.getGenres(),
  });

  return {
    genres,
    loading,
    error: error instanceof Error ? error.message : null
  };
}
