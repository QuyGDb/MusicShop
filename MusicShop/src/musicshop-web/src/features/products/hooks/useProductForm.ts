import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '@/features/products/hooks/useProducts';
import { ReleaseFormat } from '@/features/products/types';
import { productSchema, ProductFormValues } from '../types/product';
import { slugify } from '@/shared/lib/utils';

interface UseProductFormProps {
  onSuccess: () => void;
  releasesData: any;
  versionsData: any;
}

import { UseFormRegister, Control, FieldErrors } from 'react-hook-form';

interface UseProductFormReturn {
  register: UseFormRegister<ProductFormValues>;
  control: Control<ProductFormValues>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<ProductFormValues>;
  selectedReleaseId: string;
  setSelectedReleaseId: (id: string) => void;
  handleVersionChange: (versionId: string) => void;
  isPending: boolean;
}


export function useProductForm({ onSuccess, releasesData, versionsData }: UseProductFormProps) {


  const [selectedReleaseId, setSelectedReleaseId] = useState<string>('');
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,

    defaultValues: {
      releaseVersionId: '',
      name: '',
      slug: '',
      description: '',
      coverUrl: '',
      format: ReleaseFormat.Vinyl,
      isLimited: false,
      limitedQty: undefined,
      isPreorder: false,
      preorderReleaseDate: undefined,
    }
  });

  const onSubmit = async (value: ProductFormValues) => {
    createProduct.mutate(value, {
      onSuccess: (newProductId) => {
        onSuccess();
        navigate(`/admin/products/${newProductId}`);
      }
    });
  };

  const handleVersionChange = (versionId: string) => {
    const version = versionsData?.find((v: any) => v.id === versionId);
    const release = releasesData?.items.find((r: any) => r.id === selectedReleaseId);

    if (version && release) {
      setValue('name', `${release.title} (${version.notes || version.pressingCountry})`, { shouldValidate: true });
      setValue('slug', slugify(`${release.slug}-${version.pressingCountry}-${version.id.slice(0, 4)}`), { shouldValidate: true });
      setValue('coverUrl', release.coverUrl || '', { shouldValidate: true });
      setValue('format', version.format, { shouldValidate: true });
    }
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(onSubmit) as any,

    errors,
    selectedReleaseId,
    setSelectedReleaseId,
    handleVersionChange,
    isPending: createProduct.isPending || isSubmitting,
  };
}

