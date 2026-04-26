import http from '@/shared/api/axiosInstance';
import { ApiResponse, PaginatedResponse } from '@/shared/types/api';
import { Genre } from '../types';

export interface CreateGenreRequest {
  name: string;
}

export interface UpdateGenreRequest {
  name: string;
}

export const genreService = {
  getGenres: async (page = 1, limit = 50, search?: string): Promise<PaginatedResponse<Genre>> => {
    const response = await http.get<ApiResponse<Genre[]>>('/Genres', {
      params: { 
        PageNumber: page, 
        PageSize: limit,
        Q: search
      }
    });
    return {
      items: response.data || [],
      meta: response.meta
    };
  },

  getGenreBySlug: async (slug: string): Promise<Genre> => {
    const response = await http.get<ApiResponse<Genre>>(`/Genres/${slug}`);
    if (!response.data) throw new Error('Genre not found');
    return response.data;
  },

  createGenre: async (data: CreateGenreRequest): Promise<string> => {
    const response = await http.post<ApiResponse<string>>('/Genres', data);
    if (!response.data) throw new Error('Failed to create genre');
    return response.data;
  },

  updateGenre: async (id: string, data: UpdateGenreRequest): Promise<Genre> => {
    const response = await http.put<ApiResponse<Genre>>(`/Genres/${id}`, data);
    if (!response.data) throw new Error('Failed to update genre');
    return response.data;
  },

  deleteGenre: async (id: string): Promise<void> => {
    await http.delete(`/Genres/${id}`);
  }
};
