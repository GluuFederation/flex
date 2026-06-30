import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Logging } from 'JansConfigApi'
import type { LogAuditParams } from 'Utils/AuditLogger'
import {
  useLoggingConfig,
  useUpdateLoggingConfig,
} from 'Plugins/auth-server/components/Logging/hooks/useLoggingApi'
import type { UpdateLoggingParams } from 'Plugins/auth-server/components/Logging/types/UseLoggingApiTypes'

const mockGetQuery = jest.fn()
const mockPutMutateAsync = jest.fn()
const mockLogAuditUserAction = jest.fn()
const mockLoggerError = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetConfigLogging: () => mockGetQuery(),
  usePutConfigLogging: () => ({ mutateAsync: mockPutMutateAsync, isPending: false }),
  getGetConfigLoggingQueryKey: () => ['config', 'logging'],
}))

jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: (params: LogAuditParams) => mockLogAuditUserAction(params),
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    error: (message: string, detail: Error | string) => mockLoggerError(message, detail),
  },
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const loggingData: Logging = { loggingLevel: 'DEBUG' }

const updateParams: UpdateLoggingParams = {
  data: loggingData,
  userMessage: 'updated logging',
  changedFields: { loggingLevel: { oldValue: 'INFO', newValue: 'DEBUG' } },
}

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

describe('useLoggingApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogAuditUserAction.mockResolvedValue(undefined)
    mockPutMutateAsync.mockResolvedValue(loggingData)
    mockGetQuery.mockReturnValue({ data: loggingData, isError: false, error: null })
  })

  describe('useLoggingConfig', () => {
    it('returns the underlying query object', () => {
      const store = buildStore(true)
      const { result } = renderHook(() => useLoggingConfig(), { wrapper: createWrapper(store) })
      expect(result.current.data).toEqual(loggingData)
    })
  })

  describe('useUpdateLoggingConfig', () => {
    it('exposes a mutateAsync function', () => {
      const store = buildStore(true)
      const { result } = renderHook(() => useUpdateLoggingConfig(), {
        wrapper: createWrapper(store),
      })
      expect(typeof result.current.mutateAsync).toBe('function')
    })

    it('calls the base mutation, dispatches a success toast and audits', async () => {
      const store = buildStore(true)
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      const { result } = renderHook(() => useUpdateLoggingConfig(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await result.current.mutateAsync(updateParams)
      })

      expect(mockPutMutateAsync).toHaveBeenCalledWith({ data: loggingData })
      expect(dispatchSpy).toHaveBeenCalled()

      await waitFor(() => {
        expect(mockLogAuditUserAction).toHaveBeenCalledTimes(1)
      })
      expect(mockLogAuditUserAction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'UPDATE',
          resource: 'api-logging',
          message: 'updated logging',
          client_id: 'client-1',
          payload: { modifiedFields: { loggingLevel: { oldValue: 'INFO', newValue: 'DEBUG' } } },
          extra: { ip_address: '127.0.0.1' },
        }),
      )
    })

    it('logs an error when the audit call rejects but still resolves', async () => {
      const failure = new Error('audit failed')
      mockLogAuditUserAction.mockRejectedValueOnce(failure)
      const store = buildStore(true)
      const { result } = renderHook(() => useUpdateLoggingConfig(), {
        wrapper: createWrapper(store),
      })

      await act(async () => {
        await expect(result.current.mutateAsync(updateParams)).resolves.toEqual(loggingData)
      })

      await waitFor(() => {
        expect(mockLoggerError).toHaveBeenCalledWith('Failed to log logging audit action:', failure)
      })
    })
  })
})
