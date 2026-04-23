import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { 
  useCreateArtist, 
  useUpdateArtist 
} from '@/features/catalog/hooks/useArtists';
import { Artist } from '@/features/catalog/types';

const artistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  country: z.string().min(1, 'Country is required'),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
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
    onSubmit: async ({ value }) => {
      if (editingArtist) {
        await updateMutation.mutateAsync({
          id: editingArtist.id,
          data: value,
        });
      } else {
        await createMutation.mutateAsync(value);
      }
      onSuccess();
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
    const currentGenres = form.getFieldValue('genreIds');
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
