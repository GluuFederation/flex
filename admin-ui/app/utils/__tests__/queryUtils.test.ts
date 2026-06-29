import type { QueryClient } from '@tanstack/react-query'
import queryUtilsDefault, {
  DEFAULT_STALE_TIME,
  DEFAULT_GC_TIME,
  queryDefaults,
  invalidateQueriesByKey,
} from '@/utils/queryUtils'

describe('query timing constants', () => {
  it('sets the stale time to five minutes', () => {
    expect(DEFAULT_STALE_TIME).toBe(5 * 60 * 1000)
  })

  it('sets the gc time to ten minutes', () => {
    expect(DEFAULT_GC_TIME).toBe(10 * 60 * 1000)
  })
})

describe('queryDefaults', () => {
  it('wires the timing constants and disables refetch on window focus', () => {
    expect(queryDefaults.queryOptions.staleTime).toBe(DEFAULT_STALE_TIME)
    expect(queryDefaults.queryOptions.gcTime).toBe(DEFAULT_GC_TIME)
    expect(queryDefaults.queryOptions.refetchOnWindowFocus).toBe(false)
  })
})

type QueryClientStub = Pick<QueryClient, 'invalidateQueries'>

const makeQueryClient = (invalidateQueries: jest.Mock): QueryClient => {
  const stub: QueryClientStub = { invalidateQueries }
  return stub as QueryClient
}

describe('invalidateQueriesByKey', () => {
  it('calls invalidateQueries with the query key', async () => {
    const invalidateQueries = jest.fn().mockResolvedValue(undefined)
    await invalidateQueriesByKey(makeQueryClient(invalidateQueries), ['users'])
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['users'] })
  })

  it('merges additional filter options with the query key', async () => {
    const invalidateQueries = jest.fn().mockResolvedValue(undefined)
    await invalidateQueriesByKey(makeQueryClient(invalidateQueries), ['users'], { exact: true })
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['users'], exact: true })
  })
})

describe('default export', () => {
  it('re-exports queryDefaults and invalidateQueriesByKey', () => {
    expect(queryUtilsDefault.queryDefaults).toBe(queryDefaults)
    expect(queryUtilsDefault.invalidateQueriesByKey).toBe(invalidateQueriesByKey)
  })
})
