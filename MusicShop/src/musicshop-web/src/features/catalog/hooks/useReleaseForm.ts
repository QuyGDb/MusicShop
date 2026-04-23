import { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  useCreateRelease,
  useUpdateRelease,
  useCreateReleaseVersion
} from '@/features/catalog/hooks/useReleases';
import { Release } from '@/features/catalog/types';
import { releaseSchema, ReleaseFormValues } from '../types/release';

interface UseReleaseFormProps {
  initialData?: Release | null;
  onSuccess: () => void;
}

export function useReleaseForm({ initialData, onSuccess }: UseReleaseFormProps) {
  const [step, setStep] = useState(1);

  const createReleaseMutation = useCreateRelease();
  const updateReleaseMutation = useUpdateRelease();
  const addVersionMutation = useCreateReleaseVersion();

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
    },
    
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        slug: value.slug || value.title.toLowerCase().replace(/\s+/g, '-')
      };

      if (initialData) {
        updateReleaseMutation.mutate(
          { id: initialData.id, data: payload as any },
          { onSuccess }
        );
      } else {
        createReleaseMutation.mutate(payload as any, {
          onSuccess
        });
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

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
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
    addVersionMutation,
  };
}
