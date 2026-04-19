import { http } from '@/shared/services/http';
import { HttpError } from '@/shared/services/HttpError';
import { ApiResponse } from '@/shared/types/api';
import { Genre } from '../types';

export const genreService = {
  /**
   * Retrieves a list of music genres.
   */
  getGenres: async (): Promise<ApiResponse<Genre[]>> => {
    try {
      const data = await http.get<ApiResponse<Genre[]>>('/Genres');
      return data;
    } catch (error) {
      if (error instanceof HttpError) {
        return {
          success: false,
          data: null,
          error: {
            code: 'Genre.FetchError',
            message: error.message || 'Could not load genres.'
          },
          meta: null
        };
      }
      return {
        success: false,
        data: null,
        error: {
          code: 'Genre.UnknownError',
          message: 'An unexpected error occurred while fetching genres.'
        },
        meta: null
      };
    }
  }
};
