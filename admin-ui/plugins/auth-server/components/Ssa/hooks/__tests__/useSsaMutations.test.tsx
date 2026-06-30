import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useRevokeSsaWithAudit } from '../useSsaMutations'
import type { SsaAuditLogPayload } from '../../types/SsaFormTypes'
import type { CaughtError } from '../../types/ErrorTypes'

const mockRevokeMutateAsync = jest.fn()
const mockUpdateToast = jest.fn()
const mockLogSsaDeletion = jest.fn()
const mockGetErrorMessage = jest.fn()
const mockLoggerError = jest.fn()

let mockIsPending = false
let mockIsError = false
let mockError: Error | null = null

jest.mock('JansConfigApi', () => ({
  useRevokeSsa: () => ({
    mutateAsync: mockRevokeMutateAsync,
    get isPending() {
      return mockIsPending
    },
    get isError() {
      return mockIsError
    },
    get error() {
      return mockError
    },
  }),
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: (showToast: boolean, type: string, message?: string) => {
    mockUpdateToast(showToast, type, message)
    return { type: 'toast/updateToast', payload: { showToast, toastType: type, message } }
  },
}))

jest.mock('../../helper', () => ({
  logSsaDeletion: (jti: string, payload?: SsaAuditLogPayload, message?: string) =>
    mockLogSsaDeletion(jti, payload, message),
  getErrorMessage: (error: CaughtError) => mockGetErrorMessage(error),
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    error: (message: string, detail?: Error | string, meta?: Record<string, string>) =>
      mockLoggerError(message, detail, meta),
  },
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const buildStore = () =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = {}) => state,
      noReducer: (state = {}) => state,
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

describe('useRevokeSsaWithAudit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsPending = false
    mockIsError = false
    mockError = null
    mockLogSsaDeletion.mockResolvedValue(undefined)
  })

  it('exposes revokeSsa and status fields', () => {
    const store = buildStore()
    const { result } = renderHook(() => useRevokeSsaWithAudit(), { wrapper: createWrapper(store) })
    expect(typeof result.current.revokeSsa).toBe('function')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('revokes, logs deletion, dispatches success toast and calls onSuccess', async () => {
    mockRevokeMutateAsync.mockResolvedValue(undefined)
    const onSuccess = jest.fn()
    const store = buildStore()
    const { result } = renderHook(() => useRevokeSsaWithAudit({ onSuccess }), {
      wrapper: createWrapper(store),
    })

    await act(async () => {
      await result.current.revokeSsa('jti-1', 'because', { jti: 'jti-1' })
    })

    expect(mockRevokeMutateAsync).toHaveBeenCalledWith({ params: { jti: 'jti-1' } })
    expect(mockLogSsaDeletion).toHaveBeenCalledWith('jti-1', { jti: 'jti-1' }, 'because')
    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'success', undefined)
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('dispatches an error toast, calls onError and rethrows when the mutation fails', async () => {
    const failure = new Error('revoke failed')
    mockRevokeMutateAsync.mockRejectedValue(failure)
    mockGetErrorMessage.mockReturnValue('friendly error')
    const onError = jest.fn()
    const store = buildStore()
    const { result } = renderHook(() => useRevokeSsaWithAudit({ onError }), {
      wrapper: createWrapper(store),
    })

    await act(async () => {
      await expect(result.current.revokeSsa('jti-2')).rejects.toBe(failure)
    })

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'error', 'friendly error')
    expect(onError).toHaveBeenCalledWith(failure)
    expect(mockLogSsaDeletion).not.toHaveBeenCalled()
  })

  it('dispatches a warning toast when audit logging fails but still succeeds', async () => {
    mockRevokeMutateAsync.mockResolvedValue(undefined)
    mockLogSsaDeletion.mockRejectedValue(new Error('audit boom'))
    const store = buildStore()
    const { result } = renderHook(() => useRevokeSsaWithAudit(), { wrapper: createWrapper(store) })

    await act(async () => {
      await result.current.revokeSsa('jti-3')
    })

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'warning', 'messages.audit_logging_failed')
    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'success', undefined)
    expect(mockLoggerError).toHaveBeenCalled()
  })
})
