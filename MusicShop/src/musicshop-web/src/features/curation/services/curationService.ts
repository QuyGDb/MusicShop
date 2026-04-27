import http from '@/shared/api/axiosInstance';
import { ApiResponse } from '@/shared/types/api';
import { CurationFormValues, CurationItem } from '../types/curation';

export interface CurationResponse {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  itemCount: number;
}

export interface CurationDetailResponse extends CurationResponse {
  products: any[]; // Raw response from backend
}

export const curationService = {
  getCollections: async (includeUnpublished = false): Promise<CurationResponse[]> => {
    const response = await http.get<ApiResponse<CurationResponse[]>>(`/CuratedCollections?includeUnpublished=${includeUnpublished}`);
    return response.data || [];
  },

  getCollectionById: async (id: string): Promise<CurationDetailResponse & { items: CurationItem[] }> => {
    const response = await http.get<ApiResponse<any>>(`/CuratedCollections/${id}`);
    if (!response.data) throw new Error('Collection not found');
    
    // Map backend 'products' to frontend 'items'
    const items = (response.data.products || []).map((p: any) => ({
      id: p.id, // Using product ID as item ID for now
      productId: p.id,
      title: p.name,
      artistName: p.artistName || 'Unknown Artist',
      coverUrl: p.coverUrl || '',
      price: p.price || 0,
    }));

    return {
      ...response.data,
      items
    };
  },

  createCollection: async (data: CurationFormValues): Promise<string> => {
    const response = await http.post<ApiResponse<string>>('/CuratedCollections', data);
    return response.data || '';
  },

  updateCollection: async (id: string, data: Partial<CurationFormValues>): Promise<void> => {
    await http.patch(`/CuratedCollections/${id}`, data);
  },

  addItem: async (collectionId: string, productId: string, sortOrder: number): Promise<void> => {
    await http.post(`/CuratedCollections/${collectionId}/items`, { productId, sortOrder });
  },

  removeItem: async (collectionId: string, productId: string): Promise<void> => {
    await http.delete(`/CuratedCollections/${collectionId}/items/${productId}`);
  },

  deleteCollection: async (id: string): Promise<void> => {
    await http.delete(`/CuratedCollections/${id}`);
  },
};
