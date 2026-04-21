export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta: MetaData | null;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface MetaData {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: MetaData | null;
}
