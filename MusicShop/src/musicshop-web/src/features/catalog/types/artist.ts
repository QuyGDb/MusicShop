import { z } from 'zod';

export const artistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  country: z.string().min(1, 'Country is required'),
  bio: z.string().optional(),
  imageUrl: z.union([z.string(), z.instanceof(File)]).optional(),
  genreIds: z.array(z.string()),
});

export type ArtistFormValues = z.infer<typeof artistSchema>;
