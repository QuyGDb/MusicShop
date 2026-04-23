import { z } from 'zod';
import { ReleaseFormat } from '@/features/products/types';

export const productSchema = z.object({
  releaseVersionId: z.string().uuid('Please select a specific release version'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  format: z.nativeEnum(ReleaseFormat),
  isLimited: z.boolean().default(false),
  limitedQty: z.number().optional().nullable(),
  isPreorder: z.boolean().default(false),
  preorderReleaseDate: z.string().optional().nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
