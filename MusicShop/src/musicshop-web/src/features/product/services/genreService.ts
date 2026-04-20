import http from '@/shared/api/axiosInstance';
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
