import { useForm, UseFormRegister, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateGenre, useUpdateGenre } from '@/features/catalog/hooks/useGenres';
import { Genre } from '@/features/catalog/types';
import { slugify } from '@/shared/lib/utils';
import { toast } from 'sonner';
import { genreSchema, GenreFormValues } from '../types/genre';

interface UseGenreFormProps {
  editingGenre: Genre | null;
  onSuccess: () => void;
}

interface UseGenreFormReturn {
  register: UseFormRegister<GenreFormValues>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<GenreFormValues>;
  handleNameChange: (name: string) => void;
  isPending: boolean;
}

export function useGenreForm({ editingGenre, onSuccess }: UseGenreFormProps): UseGenreFormReturn {
  const createMutation = useCreateGenre();
  const updateMutation = useUpdateGenre();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<GenreFormValues>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name: editingGenre?.name ?? '',
      slug: editingGenre?.slug ?? '',
    }
  });

  const onSubmit = async (values: GenreFormValues) => {
    try {
      if (editingGenre) {
        await updateMutation.mutateAsync({ 
          id: editingGenre.id, 
          data: values 
        });
        toast.success('Genre updated successfully');
      } else {
        await createMutation.mutateAsync(values);
        toast.success('Genre created successfully');
      }
      onSuccess();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Failed to save genre. Please try again.';
      toast.error(message);
    }
  };

  const handleNameChange = (name: string) => {
    setValue('name', name, { shouldValidate: true });
    if (!editingGenre) {
      setValue('slug', slugify(name), { shouldValidate: true });
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    handleNameChange,
    isPending: createMutation.isPending || updateMutation.isPending || isSubmitting,
  };
}
