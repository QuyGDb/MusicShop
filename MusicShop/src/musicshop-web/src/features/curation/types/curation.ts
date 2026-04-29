import { z } from 'zod';

export const curationItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  title: z.string(),
  artistName: z.string(),
  coverUrl: z.string(),
  price: z.number(),
  slug: z.string(),
});

export const curationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  isPublished: z.boolean().default(true),
  items: z.array(curationItemSchema).default([]),
});

export type CurationItem = z.infer<typeof curationItemSchema>;
export type CurationFormValues = z.infer<typeof curationSchema>;
