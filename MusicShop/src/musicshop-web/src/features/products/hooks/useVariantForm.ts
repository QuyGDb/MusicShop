import { useForm } from '@tanstack/react-form';
import { useCreateProductVariant, useUpdateProductVariant } from '@/features/products/hooks/useProducts';
import { ReleaseFormat } from '@/features/products/types';
import { variantSchema, VariantFormValues } from '../types/variant';

interface UseVariantFormProps {
  productId: string;
  format: ReleaseFormat;
  editingVariant?: any;
  onSuccess: () => void;
}

export function useVariantForm({ productId, format, editingVariant, onSuccess }: UseVariantFormProps) {
  const isEditing = !!editingVariant;
  const createMutation = useCreateProductVariant(productId);
  const updateMutation = useUpdateProductVariant(productId);

  const form = useForm({
    defaultValues: {
      variantName: editingVariant?.variantName || '',
      price: editingVariant?.price || 0,
      stockQty: editingVariant?.stockQty || 0,
      isSigned: editingVariant?.isSigned || false,
      isAvailable: editingVariant?.isAvailable ?? true,
      vinylAttributes: editingVariant?.vinylAttributes || {
        discColor: 'black',
        weightGrams: 180,
        speedRpm: 33,
        discCount: '1lp',
        sleeveType: 'standard',
      },
      cdAttributes: editingVariant?.cdAttributes || {
        edition: 'standard',
        isJapanEdition: false,
      },
      cassetteAttributes: editingVariant?.cassetteAttributes || {
        tapeColor: 'black',
        edition: 'standard',
      },
    } as VariantFormValues,
    onSubmit: async ({ value }) => {
      const payload: any = {
        variantName: value.variantName,
        price: value.price,
        stockQty: value.stockQty,
        isSigned: value.isSigned,
        isAvailable: value.isAvailable,
      };

      if (format === ReleaseFormat.Vinyl) payload.vinylAttributes = value.vinylAttributes;
      if (format === ReleaseFormat.CD) payload.cdAttributes = value.cdAttributes;
      if (format === ReleaseFormat.Cassette) payload.cassetteAttributes = value.cassetteAttributes;

      if (isEditing) {
        updateMutation.mutate(
          { variantId: editingVariant.id, data: payload },
          { onSuccess }
        );
      } else {
        createMutation.mutate(payload, {
          onSuccess
        });
      }
    },
  });

  return {
    form,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
