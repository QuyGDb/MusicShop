import { useForm, standardSchemaValidators } from '@tanstack/react-form';
import { curationSchema, CurationFormValues } from '../types/curation';

interface UseCurationFormProps {
  collectionId: string | null;
  initialItems: any[];
  onSuccess: () => void;
}

export function useCurationForm({ collectionId, initialItems, onSuccess }: UseCurationFormProps) {
  const form = useForm({
    defaultValues: {
      title: 'New Arrivals',
      description: 'Explore the latest synth treasures in our catalog.',
      items: initialItems,
    } as CurationFormValues,
    onSubmit: async ({ value }) => {
      // Simulate API call
      console.log('Saving curation:', value);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSuccess();
    },
  });

  const handleRemoveItem = (id: string) => {
    const currentItems = form.getFieldValue('items');
    form.setFieldValue('items', currentItems.filter((item) => item.id !== id));
  };

  return {
    form,
    handleRemoveItem,
  };
}
