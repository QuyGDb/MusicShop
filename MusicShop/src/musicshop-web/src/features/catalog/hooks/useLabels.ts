import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { labelService, CreateLabelRequest, UpdateLabelRequest } from '../services/labelService';
import { toast } from 'sonner';

export function useLabels(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['labels', { page, limit }],
    queryFn: () => labelService.getLabels(page, limit),
  });
}

export function useCreateLabel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateLabelRequest) => labelService.createLabel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast.success('Label created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create label');
    }
  });
}

export function useUpdateLabel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateLabelRequest }) => 
      labelService.updateLabel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast.success('Label updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update label');
    }
  });
}

export function useDeleteLabel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => labelService.deleteLabel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast.success('Label deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete label');
    }
  });
}
