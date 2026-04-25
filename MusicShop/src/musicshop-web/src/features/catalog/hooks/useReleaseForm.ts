import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRelease, useUpdateRelease } from '@/features/catalog/hooks/useReleases';
import { Release } from '@/features/catalog/types';
import { releaseSchema, ReleaseFormValues } from '../types/release';
import { uploadService } from '@/shared/services/uploadService';
import { toast } from 'sonner';
import { slugify } from '@/shared/lib/utils';

interface UseReleaseFormProps {
  initialData?: Release | null;
  onSuccess: () => void;
}

export function useReleaseForm({ initialData, onSuccess }: UseReleaseFormProps) {
  const [step, setStep] = useState(1);

  const createReleaseMutation = useCreateRelease();
  const updateReleaseMutation = useUpdateRelease();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ReleaseFormValues>({
    resolver: zodResolver(releaseSchema) as any,

    defaultValues: {
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      artistId: initialData?.artistId ?? '',
      year: initialData?.year ?? new Date().getFullYear(),
      type: (initialData?.type as any) ?? 'Album',
      description: initialData?.description ?? '',
      coverUrl: initialData?.coverUrl ?? '',
      genreIds: [],
      tracks: initialData?.tracks ?? []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tracks'
  });

  // Sync initialData when it changes (e.g. when loading finishes)
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        slug: initialData.slug,
        artistId: initialData.artistId,
        year: initialData.year,
        type: initialData.type as any,
        description: initialData.description || '',
        coverUrl: initialData.coverUrl || '',
        genreIds: [], // Assuming genres might be handled separately or added later
        tracks: initialData.tracks || []
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (value: ReleaseFormValues) => {
    try {
      let finalCoverUrl = value.coverUrl;

      if (value.coverUrl instanceof File) {
        finalCoverUrl = await uploadService.uploadImage(value.coverUrl, 'releases');
      }

      const payload = {
        ...value,
        coverUrl: finalCoverUrl as string,
        slug: value.slug || slugify(value.title)
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
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleAddTrack = () => {
    append({ position: fields.length + 1, title: '', durationSeconds: 0 });
  };

  const handleRemoveTrack = (index: number) => {
    remove(index);
    // Re-calculate positions for remaining tracks
    const currentTracks = getValues('tracks');
    currentTracks.forEach((track, i) => {
      setValue(`tracks.${i}.position`, i + 1);
    });
  };

  const isPending = createReleaseMutation.isPending || updateReleaseMutation.isPending || isSubmitting;

  return {
    register,
    control,
    handleSubmit: handleSubmit(onSubmit) as any,

    errors,
    step,
    setStep,
    nextStep,
    prevStep,
    handleAddTrack,
    handleRemoveTrack,
    isPending,
    fields, // Passing fields for TracklistStep
  };
}

