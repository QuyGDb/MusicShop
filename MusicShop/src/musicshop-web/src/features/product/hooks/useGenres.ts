import { useState, useEffect } from 'react';
import { genreService } from '../services/genreService';
import { Genre } from '../types';

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const result = await genreService.getGenres();
        
        if (result.success) {
          setGenres(result.data || []);
        } else {
          setError(result.error?.message || 'Failed to load genres');
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching genres.');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return {
    genres,
    loading,
    error
  };
}
