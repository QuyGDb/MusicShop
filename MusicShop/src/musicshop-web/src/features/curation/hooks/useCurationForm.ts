import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { curationSchema, CurationFormValues } from '../types/curation';

interface UseCurationFormProps {
  collectionId: string | null;
  initialItems: any[];
  onSuccess: () => void;
}

import { UseFormRegister, Control, FieldErrors, UseFieldArrayRemove } from 'react-hook-form';

interface UseCurationFormReturn {
  register: UseFormRegister<CurationFormValues>;
  control: Control<CurationFormValues>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<CurationFormValues>;
  items: any[];
  removeItem: UseFieldArrayRemove;
  isSubmitting: boolean;
}

export function useCurationForm({ collectionId, initialItems, onSuccess }: UseCurationFormProps): UseCurationFormReturn {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CurationFormValues>({
    resolver: zodResolver(curationSchema) as any,
    defaultValues: {
      title: 'New Arrivals',
      description: 'Explore the latest synth treasures in our catalog.',
      items: initialItems,
    },
  });

  const { fields: items, remove: removeItem } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (value: CurationFormValues) => {
    // Simulate API call
    console.log('Saving curation:', value);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSuccess();
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(onSubmit) as any,
    errors,
    items,
    removeItem,
    isSubmitting,
  };
}
