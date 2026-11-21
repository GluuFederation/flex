import React from 'react'
import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { GetLockStatParams } from 'JansConfigApi'
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
  useGetLockStat: (params: GetLockStatParams, opts: { query: QueryOptions }) =>
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
  mockUseGetLockStat.mockImplementation(
    (_params: GetLockStatParams, opts: { query: QueryOptions }) => {
      const data = opts.query.select ? opts.query.select(raw) : raw
      return { data, isLoading: false, isError: false }
    },
  )
}

describe('useDashboardLockStats', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it.each([
    ['mid-year', new Date(2026, 10, 15), '202512', '202611'],
    ['January', new Date(2027, 0, 15), '202602', '202701'],
    ['the 31st', new Date(2026, 2, 31), '202504', '202603'],
  ])('requests the last 12 months from %s', (_label, now, start, end) => {
    jest.useFakeTimers({ now })
    mockQueryReturn(undefined)
    const store = buildStore(true)
    renderHook(() => useDashboardLockStats(), { wrapper: createWrapper(store) })

    const [params] = mockUseGetLockStat.mock.calls[0]
    expect(params).toEqual({ 'start-month': start, 'end-month': end })
  })

  it('returns an empty data array and zeroed stats when there is no data', () => {
    mockQueryReturn(undefined)
    const store = buildStore(true)
    const { result } = renderHook(() => useDashboardLockStats(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.data).toHaveLength(0)
    expect(result.current.maxStats).toEqual({
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
    expect(result.current.maxStats).toEqual({
      monthly_active_users: 10,
      monthly_active_clients: 5,
    })
  })

  it('returns the highest month for each field in any response order', () => {
    mockQueryReturn([
      { monthly_active_users: 10, monthly_active_clients: 9, month: '202609' },
      { monthly_active_users: 30, monthly_active_clients: 2, month: '202611' },
      { monthly_active_users: 5, monthly_active_clients: 4, month: '202610' },
    ])
    const store = buildStore(true)
    const { result } = renderHook(() => useDashboardLockStats(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.data).toHaveLength(3)
    expect(result.current.maxStats).toEqual({
      monthly_active_users: 30,
      monthly_active_clients: 9,
    })
  })

  it('treats missing numeric fields as zero', () => {
    mockQueryReturn([{ monthly_active_users: 7, month: '202611' }])
    const store = buildStore(true)
    const { result } = renderHook(() => useDashboardLockStats(), {
      wrapper: createWrapper(store),
    })

    expect(result.current.maxStats).toEqual({
      monthly_active_users: 7,
      monthly_active_clients: 0,
    })
  })

  it('keeps data, stats and params stable between renders when the query has no data', () => {
    mockUseGetLockStat.mockReturnValue({ data: undefined, isLoading: false })
    const store = buildStore(true)
    const { result, rerender } = renderHook(() => useDashboardLockStats(), {
      wrapper: createWrapper(store),
    })
    const { data, maxStats } = result.current

    rerender()

    expect(result.current.data).toBe(data)
    expect(result.current.maxStats).toBe(maxStats)
    expect(mockUseGetLockStat.mock.calls[1][0]).toBe(mockUseGetLockStat.mock.calls[0][0])
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
