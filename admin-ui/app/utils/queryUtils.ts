import type { QueryClient, QueryKey, InvalidateQueryFilters } from '@tanstack/react-query'

const STALE_TIME = 5 * 60 * 1000
const GC_TIME = 10 * 60 * 1000

export const queryDefaults = {
  queryOptions: {
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
  } as const,
} as const

export function invalidateQueriesByKey(
  queryClient: QueryClient,
  queryKey: QueryKey,
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
): Promise<void> {
  return queryClient.invalidateQueries({ queryKey, ...options })
}

export function removeQueriesByKey(queryClient: QueryClient, queryKey: QueryKey): void {
  queryClient.removeQueries({ queryKey })
}

export function refetchQueriesByKey(
  queryClient: QueryClient,
  queryKey: QueryKey,
  options?: { type?: 'active' | 'inactive' | 'all' },
): Promise<void> {
  return queryClient.refetchQueries({ queryKey, ...options })
}

export default {
  queryDefaults,
  invalidateQueriesByKey,
  removeQueriesByKey,
  refetchQueriesByKey,
}
