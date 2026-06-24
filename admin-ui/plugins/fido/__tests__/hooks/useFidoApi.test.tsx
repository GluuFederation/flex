import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useFidoConfig, useUpdateFidoConfig } from 'Plugins/fido/hooks/useFidoApi'
import type { UpdateFidoParams } from 'Plugins/fido/types'
import type { LogAuditParams } from 'Utils/AuditLogger'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

const dynamicParams: UpdateFidoParams = {
  type: 'dynamic',
  userMessage: 'update',
  data: {
    issuer: 'https://updated',
    baseEndpoint: 'https://updated/fido2',
    cleanServiceInterval: 60,
    cleanServiceBatchChunkSize: 100,
    useLocalCache: true,
    disableJdkLogger: false,
    loggingLevel: 'INFO',
    loggingLayout: 'text',
    metricReporterEnabled: true,
    metricReporterInterval: 300,
    metricReporterKeepDataDays: 15,
    personCustomObjectClassList: [],
    fido2MetricsEnabled: true,
    fido2MetricsRetentionDays: 30,
    fido2DeviceInfoCollection: true,
    fido2ErrorCategorization: true,
    fido2PerformanceMetrics: true,
  },
}

const mockGetQuery = jest.fn()
const mockPutMutate = jest.fn()
const mockLogAuditUserAction = jest.fn()
const mockTriggerWebhook = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetPropertiesFido2: () => mockGetQuery(),
  usePutPropertiesFido2: () => ({ mutate: mockPutMutate, isPending: false }),
  getGetPropertiesFido2QueryKey: () => ['fido2', 'properties'],
}))

jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: (params: LogAuditParams) => mockLogAuditUserAction(params),
}))

jest.mock('@/utils/triggerWebhookForFeature', () => ({
  triggerWebhookForFeature: (data: Record<string, JsonValue>, feature: string) =>
    mockTriggerWebhook(data, feature),
}))

const buildStore = (hasSession = true) =>
  configureStore({
    reducer: combineReducers({
      authReducer: (
        state = {
          hasSession,
          userinfo: { inum: 'inum-1', name: 'admin' },
          config: { clientId: 'client-1' },
          location: { IPv4: '127.0.0.1' },
        },
      ) => state,
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

describe('useFidoApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogAuditUserAction.mockResolvedValue(undefined)
    mockGetQuery.mockReturnValue({
      data: { issuer: 'https://issuer', fido2Configuration: { mdsCertsFolder: '/certs' } },
      isError: false,
      error: null,
    })
  })

  describe('useFidoConfig', () => {
    it('returns the underlying query object', () => {
      const store = buildStore(true)
      const { result } = renderHook(() => useFidoConfig(), { wrapper: createWrapper(store) })
      expect(result.current.data).toBeDefined()
      expect(result.current.isError).toBe(false)
    })

    it('does not dispatch a toast when there is no error', () => {
      const store = buildStore(true)
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      renderHook(() => useFidoConfig(), { wrapper: createWrapper(store) })
      expect(dispatchSpy).not.toHaveBeenCalled()
    })

    it('dispatches an error toast when the query errors', async () => {
      mockGetQuery.mockReturnValue({
        data: undefined,
        isError: true,
        error: new Error('boom'),
      })
      const store = buildStore(true)
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      renderHook(() => useFidoConfig(), { wrapper: createWrapper(store) })
      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalled()
      })
    })
  })

  describe('useUpdateFidoConfig', () => {
    it('exposes a mutate function', () => {
      const store = buildStore(true)
      const { result } = renderHook(() => useUpdateFidoConfig(), { wrapper: createWrapper(store) })
      expect(typeof result.current.mutate).toBe('function')
    })

    it('dispatches an error toast when no configuration is loaded', () => {
      mockGetQuery.mockReturnValue({ data: undefined, isError: false, error: null })
      const store = buildStore(true)
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      const { result } = renderHook(() => useUpdateFidoConfig(), { wrapper: createWrapper(store) })

      act(() => {
        result.current.mutate(dynamicParams)
      })

      expect(dispatchSpy).toHaveBeenCalled()
      expect(mockPutMutate).not.toHaveBeenCalled()
    })

    it('calls the underlying mutation when configuration is loaded', () => {
      const store = buildStore(true)
      const { result } = renderHook(() => useUpdateFidoConfig(), { wrapper: createWrapper(store) })

      act(() => {
        result.current.mutate(dynamicParams)
      })

      expect(mockPutMutate).toHaveBeenCalledTimes(1)
    })
  })
})
