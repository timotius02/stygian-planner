import { useQuery } from '@tanstack/react-query';
import { enkaApiService } from '@/services/enkaApi';
import type { EnkaPlayerData } from '@/types/enka';

const ENKA_QUERY_KEY = 'enka';

/**
 * React Query hook for fetching Enka Network player data
 */
export function useEnkaQuery(uid: string | null) {
  return useQuery<EnkaPlayerData, Error>({
    queryKey: [ENKA_QUERY_KEY, uid],
    queryFn: async () => {
      if (!uid) {
        throw new Error('UID is required');
      }
      return enkaApiService.fetchPlayerData(uid);
    },
    enabled: !!uid && uid.length > 0,
    staleTime: 60000, // 1 minute - Enka has rate limits
    retry: (failureCount, error) => {
      // Don't retry on 404 (private profile or invalid UID)
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to get cached Enka data if available
 */
export function useEnkaCache(uid: string | null) {
  return useQuery<EnkaPlayerData, Error>({
    queryKey: [ENKA_QUERY_KEY, uid],
    queryFn: async () => {
      if (!uid) {
        throw new Error('UID is required');
      }
      return enkaApiService.fetchPlayerData(uid);
    },
    enabled: false, // Don't fetch, just check cache
  });
}
