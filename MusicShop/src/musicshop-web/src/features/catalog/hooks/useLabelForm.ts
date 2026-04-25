import { useForm, UseFormRegister, Control, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLabel, useUpdateLabel } from '@/features/catalog/hooks/useLabels';
import { Label } from '@/features/catalog/types';
import { slugify } from '@/shared/lib/utils';
import { toast } from 'sonner';
import { labelSchema, LabelFormValues } from '../types/label';

interface UseLabelFormProps {
  editingLabel: Label | null;
  onSuccess: () => void;
}

interface UseLabelFormReturn {
  register: UseFormRegister<LabelFormValues>;
  control: Control<LabelFormValues>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<LabelFormValues>;
  handleNameChange: (name: string) => void;
  isPending: boolean;
}

export function useLabelForm({ editingLabel, onSuccess }: UseLabelFormProps): UseLabelFormReturn {
  const createMutation = useCreateLabel();
  const updateMutation = useUpdateLabel();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<LabelFormValues>({
    resolver: zodResolver(labelSchema),
    defaultValues: {
      name: editingLabel?.name ?? '',
      slug: editingLabel?.slug ?? '',
      country: editingLabel?.country ?? '',
      foundedYear: editingLabel?.foundedYear,
      website: editingLabel?.website ?? '',
    }
  });

  const onSubmit = async (values: LabelFormValues) => {
    try {
      if (editingLabel) {
        await updateMutation.mutateAsync({ 
          id: editingLabel.id, 
          data: values 
        });
      } else {
        await createMutation.mutateAsync(values);
      }
      onSuccess();
    } catch (error) {
      // Errors are handled by mutation hooks
    }
  };

  const handleNameChange = (name: string) => {
    setValue('name', name, { shouldValidate: true });
    // Auto-generate slug if not editing or if name matches current slug
    if (!editingLabel) {
      setValue('slug', slugify(name), { shouldValidate: true });
    }
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    handleNameChange,
    isPending: createMutation.isPending || updateMutation.isPending || isSubmitting,
  };
}
