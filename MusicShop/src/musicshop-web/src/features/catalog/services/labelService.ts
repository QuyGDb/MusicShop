import http from '@/shared/api/axiosInstance';
import { ApiResponse, PaginatedResponse } from '@/shared/types/api';
import { Label } from '../types';

export interface CreateLabelRequest {
  name: string;
  country: string;
  foundedYear?: number;
  website?: string;
}

export interface UpdateLabelRequest extends CreateLabelRequest {
  slug: string;
}

export const labelService = {
  getLabels: async (page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Label>> => {
    const response = await http.get<ApiResponse<Label[]>>('/Labels', {
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

  getLabelBySlug: async (slug: string): Promise<Label> => {
    const response = await http.get<ApiResponse<Label>>(`/Labels/${slug}`);
    if (!response.data) throw new Error('Label not found');
    return response.data;
  },

  createLabel: async (data: CreateLabelRequest): Promise<string> => {
    const response = await http.post<ApiResponse<string>>('/Labels', data);
    if (!response.data) throw new Error('Failed to create label');
    return response.data;
  },

  updateLabel: async (id: string, data: UpdateLabelRequest): Promise<string> => {
    const response = await http.put<ApiResponse<string>>(`/Labels/${id}`, data);
    if (!response.data) throw new Error('Failed to update label');
    return response.data;
  },

  deleteLabel: async (id: string): Promise<void> => {
    await http.delete(`/Labels/${id}`);
  }
};
