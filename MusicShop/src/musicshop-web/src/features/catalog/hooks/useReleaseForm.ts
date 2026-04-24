import { useState, useEffect } from 'react';
import { useForm, standardSchemaValidators } from '@tanstack/react-form';
import {
  useCreateRelease,
  useUpdateRelease
} from '@/features/catalog/hooks/useReleases';
import { Release } from '@/features/catalog/types';
import { releaseSchema, ReleaseFormValues } from '../types/release';
import { uploadService } from '@/shared/services/uploadService';
import { toast } from 'sonner';

interface UseReleaseFormProps {
  initialData?: Release | null;
  onSuccess: () => void;
}

export function useReleaseForm({ initialData, onSuccess }: UseReleaseFormProps) {
  const [step, setStep] = useState(1);

  const createReleaseMutation = useCreateRelease();
  const updateReleaseMutation = useUpdateRelease();

  const form: any = useForm({
    defaultValues: {
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      artistId: initialData?.artistId ?? '',
      year: initialData?.year ?? new Date().getFullYear(),
      type: (initialData?.type as any) ?? 'Album',
      description: initialData?.description ?? '',
      coverUrl: initialData?.coverUrl ?? '',
      genreIds: [],
      tracks: []
    } as ReleaseFormValues,
    validatorAdapter: standardSchemaValidators(),
    validators: {
      onSubmit: releaseSchema
    },
    
    onSubmit: async ({ value }) => {
      try {
        let finalCoverUrl = value.coverUrl;

        if (value.coverUrl instanceof File) {
          finalCoverUrl = await uploadService.uploadImage(value.coverUrl, 'releases');
        }

        const payload = {
          ...value,
          coverUrl: finalCoverUrl as string,
          slug: value.slug || value.title.toLowerCase().replace(/\s+/g, '-')
        };

        if (initialData) {
          await updateReleaseMutation.mutateAsync(
            { id: initialData.id, data: payload as any }
          );
          toast.success('Release updated successfully');
        } else {
          await createReleaseMutation.mutateAsync(payload as any);
          toast.success('Release created successfully');
        }
        onSuccess();
      } catch (error: any) {
        console.error('Release submission failed:', error);
        toast.error(error.response?.data?.message || 'Failed to save release. Please try again.');
      }
    },
  });

  // Sync initialData when it changes (e.g. when loading finishes)
  useEffect(() => {
    if (initialData) {
      form.setFieldValue('title', initialData.title);
      form.setFieldValue('slug', initialData.slug);
      form.setFieldValue('artistId', initialData.artistId);
      form.setFieldValue('year', initialData.year);
      form.setFieldValue('type', initialData.type as any);
      form.setFieldValue('description', initialData.description || '');
      form.setFieldValue('coverUrl', initialData.coverUrl || '');
    }
  }, [initialData, form]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleAddTrack = () => {
    const currentTracks = form.getFieldValue('tracks') || [];
    form.setFieldValue('tracks', [
      ...currentTracks,
      { position: currentTracks.length + 1, title: '', durationSeconds: 0 }
    ]);
  };

  const handleRemoveTrack = (index: number) => {
    const currentTracks = form.getFieldValue('tracks') || [];
    const newTracks = currentTracks
      .filter((_: any, i: number) => i !== index)
      .map((t: any, i: number) => ({ ...t, position: i + 1 }));
    form.setFieldValue('tracks', newTracks);
  };

  const isPending = createReleaseMutation.isPending || updateReleaseMutation.isPending;

  return {
    form,
    step,
    setStep,
    nextStep,
    prevStep,
    handleAddTrack,
    handleRemoveTrack,
    isPending,
  };
}
