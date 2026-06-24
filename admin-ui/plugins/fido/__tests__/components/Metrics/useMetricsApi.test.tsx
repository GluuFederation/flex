import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  useAdoptionMetrics,
  useErrorsAnalytics,
  usePerformanceAnalytics,
  useAggregationMetrics,
} from 'Plugins/fido/components/Metrics/hooks/useMetricsApi'
import { createDate } from '@/utils/dayjsUtils'
import type { MetricsDateRange } from 'Plugins/fido/components/Metrics/types'

const mockGet = jest.fn()

jest.mock('Orval', () => ({
  ...jest.requireActual('Orval'),
  AXIOS_INSTANCE: {
    get: (url: string, config?: { params?: Record<string, string | number> }) =>
      mockGet(url, config),
  },
}))

const buildStore = (hasSession = true) =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { hasSession }) => state,
      toastReducer: (state = { showToast: false, message: '', type: 'success' }) => state,
      noReducer: (state = {}) => state,
    }),
  })

const createWrapper = (store: ReturnType<typeof buildStore>) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  )
}

const dateRange: MetricsDateRange = {
  startDate: createDate('2024-01-01'),
  endDate: createDate('2024-01-31'),
}

describe('useMetricsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGet.mockResolvedValue({ data: { adoptionRate: 42 } })
  })

  describe('useAdoptionMetrics', () => {
    it('fetches adoption metrics when enabled with a ready date range', async () => {
      const store = buildStore(true)
      const { result } = renderHook(() => useAdoptionMetrics(dateRange), {
        wrapper: createWrapper(store),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGet).toHaveBeenCalledWith(
        '/fido2/metrics/analytics/adoption',
        expect.objectContaining({ params: expect.any(Object) }),
      )
      expect(result.current.data).toEqual({ adoptionRate: 42 })
    })

    it('does not fetch when there is no session', () => {
      const store = buildStore(false)
      renderHook(() => useAdoptionMetrics(dateRange), { wrapper: createWrapper(store) })
      expect(mockGet).not.toHaveBeenCalled()
    })

    it('does not fetch when the date range is null', () => {
      const store = buildStore(true)
      renderHook(() => useAdoptionMetrics(null), { wrapper: createWrapper(store) })
      expect(mockGet).not.toHaveBeenCalled()
    })

    it('does not fetch when explicitly disabled', () => {
      const store = buildStore(true)
      renderHook(() => useAdoptionMetrics(dateRange, { enabled: false }), {
        wrapper: createWrapper(store),
      })
      expect(mockGet).not.toHaveBeenCalled()
    })
  })

  describe('useErrorsAnalytics', () => {
    it('fetches the errors analytics endpoint', async () => {
      const store = buildStore(true)
      const { result } = renderHook(() => useErrorsAnalytics(dateRange), {
        wrapper: createWrapper(store),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGet).toHaveBeenCalledWith(
        '/fido2/metrics/analytics/errors',
        expect.objectContaining({ params: expect.any(Object) }),
      )
    })
  })

  describe('usePerformanceAnalytics', () => {
    it('fetches the performance analytics endpoint', async () => {
      const store = buildStore(true)
      const { result } = renderHook(() => usePerformanceAnalytics(dateRange), {
        wrapper: createWrapper(store),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGet).toHaveBeenCalledWith(
        '/fido2/metrics/analytics/performance',
        expect.objectContaining({ params: expect.any(Object) }),
      )
    })
  })

  describe('useAggregationMetrics', () => {
    it('fetches the aggregation endpoint for the given type', async () => {
      const store = buildStore(true)
      const { result } = renderHook(() => useAggregationMetrics('Daily', dateRange), {
        wrapper: createWrapper(store),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGet).toHaveBeenCalledWith(
        '/fido2/metrics/aggregations/Daily',
        expect.objectContaining({
          params: expect.objectContaining({ limit: 50, startIndex: 0 }),
        }),
      )
    })

    it('does not fetch when the date range is null', () => {
      const store = buildStore(true)
      renderHook(() => useAggregationMetrics('Daily', null), { wrapper: createWrapper(store) })
      expect(mockGet).not.toHaveBeenCalled()
    })

    it('dispatches an error toast when the request fails', async () => {
      mockGet.mockRejectedValueOnce(new Error('network'))
      const store = buildStore(true)
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      const { result } = renderHook(() => useAggregationMetrics('Weekly', dateRange), {
        wrapper: createWrapper(store),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalled()
      })
    })
  })
})
