import { z } from 'zod';

export const trackSchema = z.object({
  position: z.number().int().positive(),
  title: z.string().min(1, 'Track title is required'),
  durationSeconds: z.number().int().nonnegative().default(0),
});

export const releaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  artistId: z.string().min(1, 'Artist is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 5),
  type: z.enum(['Album', 'EP', 'Single', 'Compilation']),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  genreIds: z.array(z.string()).default([]),
  tracks: z.array(trackSchema).default([]),
});

export const releaseVersionSchema = z.object({
  labelId: z.string().min(1, 'Label is required'),
  format: z.enum(['Vinyl', 'CD', 'Cassette', 'Digital']),
  catalogNumber: z.string().min(1, 'Catalog number is required'),
  pressingCountry: z.string().min(1, 'Pressing country is required'),
  pressingYear: z.number().int().min(1900),
  notes: z.string().optional(),
});

export type ReleaseFormValues = z.infer<typeof releaseSchema>;
export type ReleaseVersionFormValues = z.infer<typeof releaseVersionSchema>;
export type TrackValues = z.infer<typeof trackSchema>;
