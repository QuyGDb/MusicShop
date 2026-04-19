import { http } from '@/shared/services/http';
import { HttpError } from '@/shared/services/HttpError';
import { ApiResponse } from '@/shared/types/api';
import { Genre } from '../types';

export const genreService = {
  /**
   * Retrieves a list of music genres.
   */
  getGenres: async (): Promise<Genre[]> => {
    const response = await http.get<ApiResponse<Genre[]>>('/Genres');
    return response.data || [];
  }
};
