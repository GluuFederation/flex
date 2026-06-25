import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useFido2HealthStatus } from '../useFido2HealthStatus'

const mockGet = jest.fn()

jest.mock('Orval', () => ({
  ...jest.requireActual('Orval'),
  AXIOS_INSTANCE: {
    get: (url: string, config?: { signal?: AbortSignal }) => mockGet(url, config),
  },
}))

const buildStore = (hasSession = true) =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { hasSession }) => state,
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

describe('useFido2HealthStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGet.mockResolvedValue({ data: { status: 'running' } })
  })

  it('fetches the fido2 health endpoint and transforms the response', async () => {
    const store = buildStore(true)
    const { result } = renderHook(() => useFido2HealthStatus(), { wrapper: createWrapper(store) })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(mockGet).toHaveBeenCalledWith('/fido2/metrics/health', expect.any(Object))
    expect(result.current.data).toEqual(
      expect.objectContaining({ name: 'fido2-metrics', status: 'up' }),
    )
    expect(result.current.data?.lastChecked).toBeInstanceOf(Date)
  })

  it('normalizes an unknown status to the default status', async () => {
    mockGet.mockResolvedValue({ data: { status: 'mystery' } })
    const store = buildStore(true)
    const { result } = renderHook(() => useFido2HealthStatus(), { wrapper: createWrapper(store) })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data?.status).toBe('unknown')
  })

  it('surfaces an error message from the response', async () => {
    mockGet.mockResolvedValue({ data: { status: 'down', error: 'service offline' } })
    const store = buildStore(true)
    const { result } = renderHook(() => useFido2HealthStatus(), { wrapper: createWrapper(store) })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual(
      expect.objectContaining({ status: 'down', error: 'service offline' }),
    )
  })

  it('does not fetch when there is no session', () => {
    const store = buildStore(false)
    renderHook(() => useFido2HealthStatus(), { wrapper: createWrapper(store) })
    expect(mockGet).not.toHaveBeenCalled()
  })

  it('does not fetch when explicitly disabled', () => {
    const store = buildStore(true)
    renderHook(() => useFido2HealthStatus({ enabled: false }), { wrapper: createWrapper(store) })
    expect(mockGet).not.toHaveBeenCalled()
  })
})
