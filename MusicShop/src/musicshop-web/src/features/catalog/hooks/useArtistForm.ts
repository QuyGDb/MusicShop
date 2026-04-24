import { useForm, standardSchemaValidators } from '@tanstack/react-form';
import { z } from 'zod';
import { useCreateArtist, useUpdateArtist } from '@/features/catalog/hooks/useArtists';
import { Artist } from '@/features/catalog/types';
import { uploadService } from '@/shared/services/uploadService';
import { toast } from 'sonner';

const artistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  country: z.string().min(1, 'Country is required'),
  bio: z.string().optional(),
  imageUrl: z.union([z.string(), z.instanceof(File)]).optional(),
  genreIds: z.array(z.string()),
});

type ArtistFormValues = z.infer<typeof artistSchema>;

interface UseArtistFormProps {
  editingArtist: Artist | null;
  onSuccess: () => void;
}

export function useArtistForm({ editingArtist, onSuccess }: UseArtistFormProps) {
  const createMutation = useCreateArtist();
  const updateMutation = useUpdateArtist();

  const form: any = useForm({
    defaultValues: {
      name: editingArtist?.name ?? '',
      slug: editingArtist?.slug ?? '',
      country: editingArtist?.country ?? '',
      bio: editingArtist?.bio ?? '',
      imageUrl: editingArtist?.imageUrl ?? '',
      genreIds: editingArtist?.genres.map((genre: any) => genre.id) ?? [],
    } as ArtistFormValues,
    validatorAdapter: standardSchemaValidators(),
    validators: {
      onChange: artistSchema,
      onSubmit: artistSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        let finalImageUrl = value.imageUrl;

        if (value.imageUrl instanceof File) {
          finalImageUrl = await uploadService.uploadImage(value.imageUrl, 'artists');
        }

        const payload = {
          ...value,
          imageUrl: finalImageUrl as string
        };

        if (editingArtist) {
          await updateMutation.mutateAsync({
            id: editingArtist.id,
            data: payload,
          });
          toast.success('Artist profile updated successfully');
        } else {
          await createMutation.mutateAsync(payload);
          toast.success('Artist registered successfully');
        }
        onSuccess();
      } catch (error: any) {
        console.error('Artist submission failed:', error);
        toast.error(error.response?.data?.message || 'Failed to save artist. Please try again.');
      }
    },
  });

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleNameChange = (name: string) => {
    form.setFieldValue('name', name);
    if (!editingArtist) {
      form.setFieldValue('slug', slugify(name));
    }
  };

  const toggleGenre = (genreId: string) => {
    const currentGenres = form.getFieldValue('genreIds') || [];
    const nextGenres = currentGenres.includes(genreId)
      ? currentGenres.filter((id: string) => id !== genreId)
      : [...currentGenres, genreId];
    form.setFieldValue('genreIds', nextGenres);
  };

  return {
    form,
    handleNameChange,
    toggleGenre,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
