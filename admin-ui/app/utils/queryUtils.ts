import type { QueryClient, QueryKey, InvalidateQueryFilters } from '@tanstack/react-query'

export const DEFAULT_STALE_TIME = 5 * 60 * 1000
export const DEFAULT_GC_TIME = 10 * 60 * 1000

export const queryDefaults = {
  queryOptions: {
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    refetchOnWindowFocus: false,
  } as const,
} as const

export const invalidateQueriesByKey = (
  queryClient: QueryClient,
  queryKey: QueryKey,
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
): Promise<void> => queryClient.invalidateQueries({ queryKey, ...options })

export default {
  queryDefaults,
  invalidateQueriesByKey,
}
