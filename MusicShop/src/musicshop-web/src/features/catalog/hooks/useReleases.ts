import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseService, CreateReleaseRequest, UpdateReleaseRequest } from '../services/releaseService';
import { toast } from 'sonner';

export function useReleases(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['releases', { page, limit }],
    queryFn: () => releaseService.getReleases(page, limit),
  });
}

export function useRelease(slug: string) {
  return useQuery({
    queryKey: ['releases', slug],
    queryFn: () => releaseService.getReleaseBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateRelease() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateReleaseRequest) => releaseService.createRelease(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      toast.success('Release created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create release');
    }
  });
}

export function useUpdateRelease() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateReleaseRequest }) => 
      releaseService.updateRelease(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      toast.success('Release updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update release');
    }
  });
}

export function useDeleteRelease() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => releaseService.deleteRelease(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      toast.success('Release deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete release');
    }
  });
}

export function useReleaseTracks(releaseId: string) {
  return useQuery({
    queryKey: ['releases', releaseId, 'tracks'],
    queryFn: () => releaseService.getReleaseTracks(releaseId),
    enabled: !!releaseId,
  });
}

export function useReleaseVersions(releaseId: string) {
  return useQuery({
    queryKey: ['releases', releaseId, 'versions'],
    queryFn: () => releaseService.getReleaseVersions(releaseId),
    enabled: !!releaseId,
  });
}

export function useCreateReleaseVersion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => releaseService.createReleaseVersion(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['releases', variables.releaseId, 'versions'] });
      toast.success('Version added to release');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add version');
    }
  });
}

export function useUpdateReleaseVersion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => releaseService.updateReleaseVersion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['releases', variables.data.releaseId, 'versions'] });
      toast.success('Version updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update version');
    }
  });
}

export function useDeleteReleaseVersion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, releaseId }: { id: string, releaseId: string }) => releaseService.deleteReleaseVersion(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['releases', variables.releaseId, 'versions'] });
      toast.success('Version removed');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove version');
    }
  });
}
