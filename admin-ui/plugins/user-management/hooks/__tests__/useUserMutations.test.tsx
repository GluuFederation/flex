import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDeleteUserWithAudit } from 'Plugins/user-management/hooks/useUserMutations'
import type { CustomUser } from 'Plugins/user-management/types'

const mockDeleteMutateAsync = jest.fn()
const mockUseDeleteUser = jest.fn()
const mockInvalidateQueriesByKey = jest.fn()
const mockLogUserDeletion = jest.fn()
const mockTriggerUserWebhook = jest.fn()
const mockGetErrorMessage = jest.fn((_error: Error) => 'mapped error')
const mockUpdateToast = jest.fn((show: boolean, type: string, message?: string) => ({
  type: 'toast/update',
  payload: { show, type, message },
}))
const mockDispatch = jest.fn()
const mockLoggerError = jest.fn()

jest.mock('JansConfigApi', () => ({
  useDeleteUser: () => mockUseDeleteUser(),
  getGetUserQueryKey: () => ['users'],
}))

jest.mock('@/utils/queryUtils', () => ({
  __esModule: true,
  default: {
    invalidateQueriesByKey: (...args: Parameters<typeof mockInvalidateQueriesByKey>) =>
      mockInvalidateQueriesByKey(...args),
  },
}))

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: (show: boolean, type: string, message?: string) =>
    mockUpdateToast(show, type, message),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

jest.mock('Plugins/user-management/helper', () => ({
  logUserDeletion: (...args: Parameters<typeof mockLogUserDeletion>) =>
    mockLogUserDeletion(...args),
  getErrorMessage: (...args: Parameters<typeof mockGetErrorMessage>) =>
    mockGetErrorMessage(...args),
  triggerUserWebhook: (...args: Parameters<typeof mockTriggerUserWebhook>) =>
    mockTriggerUserWebhook(...args),
}))

jest.mock('@/constants', () => ({
  adminUiFeatures: { users_delete: 'users_delete' },
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    error: (...args: Parameters<typeof mockLoggerError>) => mockLoggerError(...args),
  },
}))

const userData: CustomUser = { inum: 'user-1', userId: 'jdoe' } as CustomUser

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useDeleteUserWithAudit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDeleteMutateAsync.mockResolvedValue(undefined)
    mockLogUserDeletion.mockResolvedValue(undefined)
    mockInvalidateQueriesByKey.mockResolvedValue(undefined)
    mockUseDeleteUser.mockReturnValue({
      mutateAsync: mockDeleteMutateAsync,
      isPending: false,
      isError: false,
      error: null,
    })
  })

  it('exposes deleteUser and pass-through mutation state', () => {
    const { result } = renderHook(() => useDeleteUserWithAudit(), { wrapper: createWrapper() })
    expect(typeof result.current.deleteUser).toBe('function')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('runs the full delete flow: delete, audit, webhook, invalidate, success toast', async () => {
    const onSuccess = jest.fn()
    const { result } = renderHook(() => useDeleteUserWithAudit({ onSuccess }), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.deleteUser('user-1', 'msg', userData)
    })

    expect(mockDeleteMutateAsync).toHaveBeenCalledWith({ inum: 'user-1' })
    expect(mockLogUserDeletion).toHaveBeenCalledWith('user-1', userData)
    expect(mockTriggerUserWebhook).toHaveBeenCalledWith(userData, 'users_delete')
    expect(mockInvalidateQueriesByKey).toHaveBeenCalledWith(expect.anything(), ['users'])
    expect(mockUpdateToast).toHaveBeenLastCalledWith(
      true,
      'success',
      'messages.user_deleted_successfully',
    )
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('does not trigger the webhook when no userData is provided', async () => {
    const { result } = renderHook(() => useDeleteUserWithAudit(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.deleteUser('user-1')
    })

    expect(mockTriggerUserWebhook).not.toHaveBeenCalled()
    expect(mockLogUserDeletion).toHaveBeenCalledWith('user-1', undefined)
  })

  it('dispatches an error toast and rethrows when the delete fails', async () => {
    const failure = new Error('delete boom')
    mockDeleteMutateAsync.mockRejectedValueOnce(failure)
    const onError = jest.fn()
    const { result } = renderHook(() => useDeleteUserWithAudit({ onError }), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await expect(result.current.deleteUser('user-1', 'msg', userData)).rejects.toThrow(
        'delete boom',
      )
    })

    expect(mockGetErrorMessage).toHaveBeenCalledWith(failure)
    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'error', 'mapped error')
    expect(onError).toHaveBeenCalledWith(failure)
    expect(mockLogUserDeletion).not.toHaveBeenCalled()
  })

  it('dispatches a warning toast and continues when audit logging fails', async () => {
    mockLogUserDeletion.mockRejectedValueOnce(new Error('audit boom'))
    const { result } = renderHook(() => useDeleteUserWithAudit(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.deleteUser('user-1', 'msg', userData)
    })

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'warning', 'messages.audit_logging_failed')
    expect(mockUpdateToast).toHaveBeenLastCalledWith(
      true,
      'success',
      'messages.user_deleted_successfully',
    )
  })

  it('dispatches a warning toast and continues when query invalidation fails', async () => {
    mockInvalidateQueriesByKey.mockRejectedValueOnce(new Error('invalidate boom'))
    const { result } = renderHook(() => useDeleteUserWithAudit(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.deleteUser('user-1', 'msg', userData)
    })

    expect(mockUpdateToast).toHaveBeenCalledWith(
      true,
      'warning',
      'messages.query_invalidation_failed',
    )
  })
})
