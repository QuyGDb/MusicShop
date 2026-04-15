export enum ReleaseFormat {
  Vinyl = 0,
  CD = 1,
  Cassette = 2,
}

export interface ProductListItem {
  id: string;
  name: string;
  artistName: string | null;
  format: ReleaseFormat;
  isLimited: boolean;
  isPreorder: boolean;
  coverUrl: string | null;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
}

export interface ProductFilters {
  format?: ReleaseFormat;
  genre?: string;
  artistId?: string;
  isLimited?: boolean;
  isPreorder?: boolean;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  page?: number;
  limit?: number;
}
