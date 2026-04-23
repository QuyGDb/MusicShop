import http from '@/shared/api/axiosInstance';
import { ApiResponse, PaginatedResponse } from '@/shared/types/api';
import { Artist, Genre } from '../types';

export interface CreateArtistRequest {
  name: string;
  slug: string;
  bio?: string;
  country: string;
  imageUrl?: string;
  genreIds: string[];
}

export interface UpdateArtistRequest extends CreateArtistRequest {
  slug: string;
}

export const artistService = {
  getArtists: async (page = 1, limit = 10): Promise<PaginatedResponse<Artist>> => {
    const response = await http.get<ApiResponse<Artist[]>>('/Artists', {
      params: { 
        PageNumber: page, 
        PageSize: limit 
      }
    });
    return {
      items: response.data || [],
      meta: response.meta
    };
  },

  getArtistBySlug: async (slug: string): Promise<Artist> => {
    const response = await http.get<ApiResponse<Artist>>(`/Artists/${slug}`);
    if (!response.data) throw new Error('Artist not found');
    return response.data;
  },

  createArtist: async (data: CreateArtistRequest): Promise<string> => {
    const response = await http.post<ApiResponse<string>>('/Artists', data);
    if (!response.data) throw new Error('Failed to create artist');
    return response.data;
  },

  updateArtist: async (id: string, data: UpdateArtistRequest): Promise<string> => {
    const response = await http.put<ApiResponse<string>>(`/Artists/${id}`, data);
    if (!response.data) throw new Error('Failed to update artist');
    return response.data;
  },

  deleteArtist: async (id: string): Promise<void> => {
    await http.delete(`/Artists/${id}`);
  }
};
