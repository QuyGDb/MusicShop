import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Global QueryClient configuration.
 * Handles automatic caching, retries, and global error processing.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 1 minute
      staleTime: 1000 * 60,
      // Retry failed queries once
      retry: 1,
      // Focus refetching is helpful for ensuring fresh data
      refetchOnWindowFocus: true,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.detail || error.response?.data?.title || error.message;
        const status = error.response?.status || 'network error';
        console.error(`[Global Query Error]: ${message} (${status})`);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.detail || error.response?.data?.title || error.message;
        const status = error.response?.status || 'network error';
        console.error(`[Global Mutation Error]: ${message} (${status})`);
      }
    },
  }),
});
