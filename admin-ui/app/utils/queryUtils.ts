import type { QueryClient, QueryKey, InvalidateQueryFilters } from '@tanstack/react-query'

export const queryDefaults = {
  staleTimeMs: 5 * 60 * 1000, //300 seconds
  gcTimeMs: 10 * 60 * 1000, //600 seconds
  refetchOnWindowFocus: false,
  queryOptions: {
    staleTimeMs: 5 * 60 * 1000, //300 seconds
    staleTime: 5 * 60 * 1000,
    gcTimeMs: 10 * 60 * 1000, //600 seconds
    gcTime: 10 * 60 * 1000,
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

export function removeQueriesByKey(queryClient: QueryClient, queryKey: QueryKey): Promise<void> {
  queryClient.removeQueries({ queryKey })
  return Promise.resolve()
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
