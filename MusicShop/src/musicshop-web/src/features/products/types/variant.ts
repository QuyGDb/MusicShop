import { z } from 'zod';

export const variantBaseSchema = z.object({
  variantName: z.string().min(1, 'Name is required'),
  price: z.number().min(0.01, 'Price must be positive'),
  stockQty: z.number().min(0, 'Stock cannot be negative'),
  isSigned: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
});

export const vinylAttributesSchema = z.object({
  discColor: z.enum(['black', 'colored', 'splatter', 'picture_disc']),
  weightGrams: z.coerce.number().pipe(z.union([z.literal(140), z.literal(180)])),
  speedRpm: z.coerce.number().pipe(z.union([z.literal(33), z.literal(45)])),
  discCount: z.enum(['1lp', '2lp', 'box_set']),
  sleeveType: z.enum(['standard', 'gatefold', 'obi_strip']),
});

export const cdAttributesSchema = z.object({
  edition: z.enum(['standard', 'deluxe', 'box_set']),
  isJapanEdition: z.boolean().default(false),
});

export const cassetteAttributesSchema = z.object({
  tapeColor: z.enum(['black', 'clear', 'white', 'colored']),
  edition: z.enum(['standard', 'limited']),
});

export const variantSchema = variantBaseSchema.extend({
  vinylAttributes: vinylAttributesSchema.optional(),
  cdAttributes: cdAttributesSchema.optional(),
  cassetteAttributes: cassetteAttributesSchema.optional(),
});

export type VariantFormValues = z.infer<typeof variantSchema>;
export type VinylAttributes = z.infer<typeof vinylAttributesSchema>;
export type CdAttributes = z.infer<typeof cdAttributesSchema>;
export type CassetteAttributes = z.infer<typeof cassetteAttributesSchema>;
