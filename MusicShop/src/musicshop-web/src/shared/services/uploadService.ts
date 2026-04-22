import axiosInstance from "@/shared/api/axiosInstance";

export const uploadService = {
  uploadImage: async (file: File, folder: string = 'general'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axiosInstance.post<{ data: string }>('/uploads/image', formData, {
      params: { folder },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },
};
