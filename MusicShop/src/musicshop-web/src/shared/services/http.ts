import { HttpClient } from './HttpClient';

/**
 * Singleton instance of HttpClient configured with the base API URL.
 */
export const http = new HttpClient(
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
);
