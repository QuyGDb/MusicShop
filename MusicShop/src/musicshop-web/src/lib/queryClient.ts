import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { HttpError } from '@/shared/services/HttpError';

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
      if (error instanceof HttpError) {
        console.error(`[Global Query Error]: ${error.message} (${error.status})`);
        // Here we could trigger a global toast/notification
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (error instanceof HttpError) {
        console.error(`[Global Mutation Error]: ${error.message} (${error.status})`);
        // Here we could trigger a global toast/notification
      }
    },
  }),
});
