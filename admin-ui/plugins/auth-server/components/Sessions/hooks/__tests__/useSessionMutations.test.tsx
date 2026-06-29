import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { LogAuditParams } from 'Utils/AuditLogger'
import { useDeleteSessionWithAudit, useRevokeSessionWithAudit } from '../useSessionMutations'
import type { AuditContext } from '../../types'

const mockDeleteMutateAsync = jest.fn()
const mockRevokeMutateAsync = jest.fn()
const mockUpdateToast = jest.fn()
const mockLogAuditUserAction = jest.fn()
const mockLoggerError = jest.fn()

jest.mock('JansConfigApi', () => ({
  useDeleteSession: () => ({
    mutateAsync: mockDeleteMutateAsync,
    isPending: false,
    isError: false,
    error: null,
  }),
  useRevokeUserSession: () => ({
    mutateAsync: mockRevokeMutateAsync,
    isPending: false,
    isError: false,
    error: null,
  }),
  getGetSessionsQueryKey: () => ['/sessions'],
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: (showToast: boolean, type: string, message?: string) => {
    mockUpdateToast(showToast, type, message)
    return { type: 'toast/updateToast', payload: { showToast, toastType: type, message } }
  },
}))

jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: (params: LogAuditParams) => mockLogAuditUserAction(params),
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

const auditContext: AuditContext = {
  userinfo: { inum: 'user-1', name: 'admin' },
  client_id: 'client-1',
}

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

describe('useDeleteSessionWithAudit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogAuditUserAction.mockResolvedValue(undefined)
  })

  it('exposes deleteSession and status fields', () => {
    const store = buildStore()
    const { result } = renderHook(() => useDeleteSessionWithAudit(auditContext), {
      wrapper: createWrapper(store),
    })
    expect(typeof result.current.deleteSession).toBe('function')
    expect(result.current.isLoading).toBe(false)
  })

  it('deletes, logs the audit action, dispatches success and calls onSuccess', async () => {
    mockDeleteMutateAsync.mockResolvedValue(undefined)
    const onSuccess = jest.fn()
    const store = buildStore()
    const { result } = renderHook(() => useDeleteSessionWithAudit(auditContext, { onSuccess }), {
      wrapper: createWrapper(store),
    })

    await act(async () => {
      await result.current.deleteSession('sid-1', 'reason', 'bob')
    })

    expect(mockDeleteMutateAsync).toHaveBeenCalledWith({ sid: 'sid-1' })
    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'DELETION',
        resource: 'session',
        message: 'reason',
        client_id: 'client-1',
        payload: { sessionId: 'sid-1', username: 'bob' },
      }),
    )
    expect(mockUpdateToast).toHaveBeenCalledWith(
      true,
      'success',
      'messages.session_deleted_successfully',
    )
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('dispatches an error toast, calls onError and rethrows on delete failure', async () => {
    const failure = new Error('delete failed')
    mockDeleteMutateAsync.mockRejectedValue(failure)
    const onError = jest.fn()
    const store = buildStore()
    const { result } = renderHook(() => useDeleteSessionWithAudit(auditContext, { onError }), {
      wrapper: createWrapper(store),
    })

    await act(async () => {
      await expect(result.current.deleteSession('sid-2')).rejects.toBe(failure)
    })

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'error', 'delete failed')
    expect(onError).toHaveBeenCalledWith(failure)
    expect(mockLogAuditUserAction).not.toHaveBeenCalled()
  })

  it('dispatches a warning toast when audit logging fails', async () => {
    mockDeleteMutateAsync.mockResolvedValue(undefined)
    mockLogAuditUserAction.mockRejectedValue(new Error('audit boom'))
    const store = buildStore()
    const { result } = renderHook(() => useDeleteSessionWithAudit(auditContext), {
      wrapper: createWrapper(store),
    })

    await act(async () => {
      await result.current.deleteSession('sid-3')
    })

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'warning', 'messages.audit_logging_failed')
    expect(mockUpdateToast).toHaveBeenCalledWith(
      true,
      'success',
      'messages.session_deleted_successfully',
    )
  })
})

describe('useRevokeSessionWithAudit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogAuditUserAction.mockResolvedValue(undefined)
  })

  it('revokes, logs the audit action and dispatches success', async () => {
    mockRevokeMutateAsync.mockResolvedValue(undefined)
    const onSuccess = jest.fn()
    const store = buildStore()
    const { result } = renderHook(() => useRevokeSessionWithAudit(auditContext, { onSuccess }), {
      wrapper: createWrapper(store),
    })

    await act(async () => {
      await result.current.revokeSession('user-dn', 'reason', 'bob')
    })

    expect(mockRevokeMutateAsync).toHaveBeenCalledWith({ userDn: 'user-dn' })
    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'DELETION',
        resource: 'session',
        payload: { userDn: 'user-dn', username: 'bob' },
      }),
    )
    expect(mockUpdateToast).toHaveBeenCalledWith(
      true,
      'success',
      'messages.session_revoked_successfully',
    )
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('dispatches an error toast and rethrows on revoke failure', async () => {
    const failure = new Error('revoke failed')
    mockRevokeMutateAsync.mockRejectedValue(failure)
    const onError = jest.fn()
    const store = buildStore()
    const { result } = renderHook(() => useRevokeSessionWithAudit(auditContext, { onError }), {
      wrapper: createWrapper(store),
    })

    await act(async () => {
      await expect(result.current.revokeSession('user-dn')).rejects.toBe(failure)
    })

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'error', 'revoke failed')
    expect(onError).toHaveBeenCalledWith(failure)
  })

  it('still succeeds with a warning toast when audit logging fails after a revoke', async () => {
    mockRevokeMutateAsync.mockResolvedValue(undefined)
    const auditFailure = new Error('audit boom')
    mockLogAuditUserAction.mockRejectedValue(auditFailure)
    const onSuccess = jest.fn()
    const onError = jest.fn()
    const store = buildStore()
    const { result } = renderHook(
      () => useRevokeSessionWithAudit(auditContext, { onSuccess, onError }),
      { wrapper: createWrapper(store) },
    )

    await act(async () => {
      await result.current.revokeSession('user-dn', 'reason', 'bob')
    })

    // The revoke itself still runs and the audit failure is non-fatal.
    expect(mockRevokeMutateAsync).toHaveBeenCalledWith({ userDn: 'user-dn' })
    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'warning', 'messages.audit_logging_failed')
    expect(mockUpdateToast).toHaveBeenCalledWith(
      true,
      'success',
      'messages.session_revoked_successfully',
    )
    // Audit failure is not a revoke failure: onSuccess fires, onError does not.
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onError).not.toHaveBeenCalled()
  })
})
