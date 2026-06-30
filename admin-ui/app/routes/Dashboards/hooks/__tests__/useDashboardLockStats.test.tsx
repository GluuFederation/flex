import React from 'react'
import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDashboardLockStats } from '../useDashboardLockStats'
import type { LockStatEntry } from '../../types'

type SelectFn = (data: LockStatEntry[] | undefined) => LockStatEntry[]

type QueryOptions = {
  enabled?: boolean
  select?: SelectFn
  retry?: boolean
}

const mockUseGetLockStat = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetLockStat: (params: undefined, opts: { query: QueryOptions }) =>
    mockUseGetLockStat(params, opts),
}))

const buildStore = (hasSession = true) =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { hasSession }) => state,
    }),
  })

const createWrapper = (store: ReturnType<typeof buildStore>) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  )
  return Wrapper
}

// Applies the hook-provided `select` transform to raw data, the way React Query would.
const mockQueryReturn = (raw: LockStatEntry[] | undefined) => {
  mockUseGetLockStat.mockImplementation((_params: undefined, opts: { query: QueryOptions }) => {
    const data = opts.query.select ? opts.query.select(raw) : raw
    return { data, isLoading: false, isError: false }
  })
}

describe('useDashboardLockStats', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns an empty data array and zeroed stats when there is no data', () => {
    mockQueryReturn(undefined)
    const store = buildStore(true)
    const { result } = renderHook(() => useDashboardLockStats(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.data).toHaveLength(0)
    expect(result.current.latestStats).toEqual({
      monthly_active_users: 0,
      monthly_active_clients: 0,
    })
  })

  it('returns the single entry values directly', () => {
    mockQueryReturn([{ monthly_active_users: 10, monthly_active_clients: 5, month: '2026-01' }])
    const store = buildStore(true)
    const { result } = renderHook(() => useDashboardLockStats(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.data).toHaveLength(1)
    expect(result.current.latestStats).toEqual({
      monthly_active_users: 10,
      monthly_active_clients: 5,
    })
  })

  it('sums values across multiple entries', () => {
    mockQueryReturn([
      { monthly_active_users: 10, monthly_active_clients: 5, month: '2026-01' },
      { monthly_active_users: 20, monthly_active_clients: 15, month: '2026-02' },
    ])
    const store = buildStore(true)
    const { result } = renderHook(() => useDashboardLockStats(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.latestStats).toEqual({
      monthly_active_users: 30,
      monthly_active_clients: 20,
    })
  })

  it('treats missing numeric fields as zero when summing', () => {
    mockQueryReturn([
      { monthly_active_users: 7, month: '2026-01' },
      { monthly_active_clients: 3, month: '2026-02' },
    ])
    const store = buildStore(true)
    const { result } = renderHook(() => useDashboardLockStats(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.latestStats).toEqual({
      monthly_active_users: 7,
      monthly_active_clients: 3,
    })
  })

  it('enables the query only when there is a session and enabled is true', () => {
    mockQueryReturn(undefined)
    const store = buildStore(true)
    renderHook(() => useDashboardLockStats(), { wrapper: createWrapper(store) })

    const [, opts] = mockUseGetLockStat.mock.calls[0]
    expect(opts.query.enabled).toBe(true)
    expect(opts.query.retry).toBe(false)
  })

  it('disables the query when there is no session', () => {
    mockQueryReturn(undefined)
    const store = buildStore(false)
    renderHook(() => useDashboardLockStats(), { wrapper: createWrapper(store) })

    const [, opts] = mockUseGetLockStat.mock.calls[0]
    expect(opts.query.enabled).toBe(false)
  })

  it('disables the query when the enabled option is false', () => {
    mockQueryReturn(undefined)
    const store = buildStore(true)
    renderHook(() => useDashboardLockStats({ enabled: false }), {
      wrapper: createWrapper(store),
    })

    const [, opts] = mockUseGetLockStat.mock.calls[0]
    expect(opts.query.enabled).toBe(false)
  })
})
