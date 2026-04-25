import { z } from 'zod';

export const genreSchema = z.object({
  name: z.string().min(1, 'Genre name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
});

export type GenreFormValues = z.infer<typeof genreSchema>;
