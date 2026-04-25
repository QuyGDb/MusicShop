import { z } from 'zod';

export const labelSchema = z.object({
  name: z.string().min(1, 'Label name is required'),
  slug: z.string().min(1, 'Slug is required'),
  country: z.string().min(1, 'Country is required'),
  foundedYear: z.coerce.number().int().min(1900).max(new Date().getFullYear()).optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type LabelFormValues = z.infer<typeof labelSchema>;
