import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '@/features/products/hooks/useProducts';
import { ReleaseFormat } from '@/features/products/types';
import { productSchema, ProductFormValues } from '../types/product';

interface UseProductFormProps {
  onSuccess: () => void;
  releasesData: any;
  versionsData: any;
}

export function useProductForm({ onSuccess, releasesData, versionsData }: UseProductFormProps) {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>('');
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const form = useForm({
    defaultValues: {
      releaseVersionId: '',
      name: '',
      slug: '',
      description: '',
      coverUrl: '',
      format: ReleaseFormat.Vinyl,
      isLimited: false,
      limitedQty: null,
      isPreorder: false,
      preorderReleaseDate: null,
    } as ProductFormValues,
    onSubmit: async ({ value }) => {
      createProduct.mutate(value, {
        onSuccess: (newProductId) => {
          onSuccess();
          navigate(`/admin/products/${newProductId}`);
        }
      });
    },
  });

  const handleVersionChange = (versionId: string) => {
    const version = versionsData?.find((v: any) => v.id === versionId);
    const release = releasesData?.items.find((r: any) => r.id === selectedReleaseId);

    if (version && release) {
      form.setFieldValue('name', `${release.title} (${version.notes || version.pressingCountry})`);
      form.setFieldValue('slug', `${release.slug}-${version.pressingCountry.toLowerCase()}-${version.id.slice(0, 4)}`);
      form.setFieldValue('coverUrl', release.coverUrl || '');
      form.setFieldValue('format', version.format);
    }
  };

  return {
    form,
    selectedReleaseId,
    setSelectedReleaseId,
    handleVersionChange,
    isPending: createProduct.isPending,
  };
}
