export enum ReleaseFormat {
  Vinyl = 'Vinyl',
  CD = 'CD',
  Cassette = 'Cassette'
}

export interface Product {
  id: string;
  slug: string;
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
  price: number;
  stockQty: number;
  isAvailable: boolean;
  isSigned: boolean;
}

export interface VinylAttributes {
  discColor?: string;
  weightGrams?: number;
  speedRpm?: number;
  discCount?: string;
  sleeveType?: string;
}

export interface CdAttributes {
  edition?: string;
  isJapanEdition: boolean;
}

export interface CassetteAttributes {
  tapeColor?: string;
  edition?: string;
}

export interface ProductDetail extends Product {
  vinylAttributes?: VinylAttributes;
  cdAttributes?: CdAttributes;
  cassetteAttributes?: CassetteAttributes;
}
