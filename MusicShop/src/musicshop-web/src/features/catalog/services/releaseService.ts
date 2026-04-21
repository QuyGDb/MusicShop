import http from '@/shared/api/axiosInstance';
import { ApiResponse, PaginatedResponse } from '@/shared/types/api';
import { Release, Track } from '../types';

export interface CreateReleaseRequest {
  title: string;
  year: number;
  description?: string;
  coverUrl?: string;
  artistId: string;
  type: string;
}

export interface UpdateReleaseRequest extends CreateReleaseRequest {
  slug: string;
}

export const releaseService = {
  getReleases: async (page = 1, limit = 10): Promise<PaginatedResponse<Release>> => {
    const response = await http.get<ApiResponse<Release[]>>('/Releases', {
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

  getReleaseBySlug: async (slug: string): Promise<Release> => {
    const response = await http.get<ApiResponse<Release>>(`/Releases/${slug}`);
    if (!response.data) throw new Error('Release not found');
    return response.data;
  },

  createRelease: async (data: CreateReleaseRequest): Promise<string> => {
    const response = await http.post<ApiResponse<string>>('/Releases', data);
    if (!response.data) throw new Error('Failed to create release');
    return response.data;
  },

  updateRelease: async (id: string, data: UpdateReleaseRequest): Promise<string> => {
    const response = await http.put<ApiResponse<string>>(`/Releases/${id}`, data);
    if (!response.data) throw new Error('Failed to update release');
    return response.data;
  },

  deleteRelease: async (id: string): Promise<void> => {
    await http.delete(`/Releases/${id}`);
  },

  // Track management within a release (usually included in CreateReleaseCommand)
  getReleaseTracks: async (releaseId: string): Promise<Track[]> => {
    const response = await http.get<ApiResponse<Track[]>>(`/Releases/${releaseId}/tracks`);
    return response.data || [];
  },

  // Version management (Catalog Section 2)
  getReleaseVersions: async (releaseId: string): Promise<ReleaseVersion[]> => {
    const response = await http.get<ApiResponse<ReleaseVersion[]>>(`/ReleaseVersions/by-release/${releaseId}`);
    return response.data || [];
  },

  createReleaseVersion: async (data: CreateReleaseVersionRequest): Promise<string> => {
    const response = await http.post<ApiResponse<string>>('/ReleaseVersions', data);
    if (!response.data) throw new Error('Failed to create version');
    return response.data;
  },

  updateReleaseVersion: async (id: string, data: UpdateReleaseVersionRequest): Promise<void> => {
    await http.put(`/ReleaseVersions/${id}`, data);
  },

  deleteReleaseVersion: async (id: string): Promise<void> => {
    await http.delete(`/ReleaseVersions/${id}`);
  }
};

export interface CreateReleaseVersionRequest {
  releaseId: string;
  labelId: string;
  format: string;
  catalogNumber: string;
  pressingCountry: string;
  pressingYear: number;
  notes?: string;
}

export interface UpdateReleaseVersionRequest extends CreateReleaseVersionRequest {
  id: string;
}
