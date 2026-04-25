import { ReleaseFormat } from '@/features/products/types';

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Label {
  id: string;
  name: string;
  slug: string;
  country: string;
  foundedYear?: number;
  website?: string;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  country: string;
  imageUrl?: string;
  genres: Genre[];
}

export interface Release {
  id: string;
  title: string;
  slug: string;
  year: number;
  description?: string;
  coverUrl?: string;
  artistId: string;
  artistName: string;
  type: string;
  tracks?: Track[];
}


export interface ReleaseVersion {
  id: string;
  releaseId: string;
  labelId: string;
  labelName: string;
  format: ReleaseFormat;
  catalogNumber: string;
  pressingCountry: string;
  pressingYear: number;
  notes?: string;
}

export interface Track {
  id: string;
  releaseId: string;
  position: number;
  title: string;
  durationSeconds: number;
  side?: string;
}
