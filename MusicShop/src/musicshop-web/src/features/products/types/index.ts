export enum ReleaseFormat {
  Vinyl = 'Vinyl',
  CD = 'CD',
  Cassette = 'Cassette'
}

export interface Product {
  id: string;
  releaseVersionId: string;
  name: string;
  description?: string;
  format: ReleaseFormat;
  isLimited: boolean;
  limitedQty?: number;
  isPreorder: boolean;
  preorderReleaseDate?: string;
  isActive: boolean;
  createdAt: string;
  artistName?: string | null;
  coverUrl?: string | null;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  variantName: string;
  price: number;
  stockQty: number;
  isAvailable: boolean;
  isSigned: boolean;
}

export interface VinylAttributes {
  id: string;
  productVariantId: string;
  discColor: 'black' | 'colored' | 'splatter' | 'picture_disc';
  weightGrams: 140 | 180;
  speedRpm: 33 | 45;
  discCount: '1lp' | '2lp' | 'box_set';
  sleeveType: 'standard' | 'gatefold' | 'obi_strip';
}

export interface CdAttributes {
  id: string;
  productVariantId: string;
  edition: 'standard' | 'deluxe' | 'box_set';
  isJapanEdition: boolean;
}

export interface CassetteAttributes {
  id: string;
  productVariantId: string;
  tapeColor: 'black' | 'clear' | 'white' | 'colored';
  edition: 'standard' | 'limited';
}

export interface ProductDetail extends Product {
  variants: (ProductVariant & {
    vinylAttributes?: VinylAttributes;
    cdAttributes?: CdAttributes;
    cassetteAttributes?: CassetteAttributes;
  })[];
}
