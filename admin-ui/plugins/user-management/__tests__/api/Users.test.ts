import { renderHook, act } from '@testing-library/react'
import type { QueryClient, QueryKey, InvalidateQueryFilters } from '@tanstack/react-query'
import { useDeleteUserWithAudit } from 'Plugins/user-management/hooks/useUserMutations'
import type { CustomUser, CaughtError } from 'Plugins/user-management/types'

const mockDispatch = jest.fn()
const mockMutateAsync = jest.fn()
const mockInvalidateQueriesByKey = jest.fn()
const mockLogUserDeletion = jest.fn()
const mockTriggerUserWebhook = jest.fn()
const mockGetErrorMessage = jest.fn((e: CaughtError): string =>
  e instanceof Error ? e.message : String(e),
)

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: jest.fn((show: boolean, type: string, msg: string) => ({
    type: 'toast/update',
    payload: { show, type, msg },
  })),
}))

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({}),
}))

jest.mock('JansConfigApi', () => ({
  useDeleteUser: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
    isError: false,
    error: null,
  }),
  getGetUserQueryKey: jest.fn(() => ['users']),
}))

jest.mock('@/utils/queryUtils', () => ({
  __esModule: true,
  default: {
    invalidateQueriesByKey: (
      queryClient: QueryClient,
      queryKey: QueryKey,
      options?: Omit<InvalidateQueryFilters, 'queryKey'>,
    ) => mockInvalidateQueriesByKey(queryClient, queryKey, options),
  },
}))

jest.mock('Plugins/user-management/helper', () => ({
  logUserDeletion: (inum: string, userData?: CustomUser) => mockLogUserDeletion(inum, userData),
  getErrorMessage: (e: CaughtError) => mockGetErrorMessage(e),
  triggerUserWebhook: (userData: CustomUser, feature: string) =>
    mockTriggerUserWebhook(userData, feature),
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('@/constants', () => ({
  adminUiFeatures: {
    users_delete: 'users_delete',
  },
}))

const sampleUser: CustomUser = {
  inum: 'user-123',
  userId: 'jdoe',
  mail: 'jdoe@example.com',
}

beforeEach(() => {
  jest.clearAllMocks()
  mockInvalidateQueriesByKey.mockResolvedValue(undefined)
  mockLogUserDeletion.mockResolvedValue(undefined)
  mockTriggerUserWebhook.mockImplementation(() => undefined)
})

describe('useDeleteUserWithAudit', () => {
  it('calls mutateAsync with the correct inum', async () => {
    mockMutateAsync.mockResolvedValue(undefined)
    const { result } = renderHook(() => useDeleteUserWithAudit())
    await act(async () => {
      await result.current.deleteUser('user-123', undefined, sampleUser)
    })
    expect(mockMutateAsync).toHaveBeenCalledWith({ inum: 'user-123' })
  })

  it('on success: logs audit, triggers webhook, invalidates queries, dispatches success toast, fires onSuccess', async () => {
    mockMutateAsync.mockResolvedValue(undefined)
    const onSuccess = jest.fn()
    const { result } = renderHook(() => useDeleteUserWithAudit({ onSuccess }))
    await act(async () => {
      await result.current.deleteUser('user-123', undefined, sampleUser)
    })
    expect(mockLogUserDeletion).toHaveBeenCalledWith('user-123', sampleUser)
    expect(mockTriggerUserWebhook).toHaveBeenCalledWith(sampleUser, 'users_delete')
    expect(mockInvalidateQueriesByKey).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('skips webhook when userData is not provided', async () => {
    mockMutateAsync.mockResolvedValue(undefined)
    const { result } = renderHook(() => useDeleteUserWithAudit())
    await act(async () => {
      await result.current.deleteUser('user-123')
    })
    expect(mockLogUserDeletion).toHaveBeenCalledWith('user-123', undefined)
    expect(mockTriggerUserWebhook).not.toHaveBeenCalled()
  })

  it('on mutation failure: dispatches error toast, fires onError, rethrows, skips downstream effects', async () => {
    const err = new Error('delete failed')
    mockMutateAsync.mockRejectedValue(err)
    const onError = jest.fn()
    const { result } = renderHook(() => useDeleteUserWithAudit({ onError }))
    await expect(
      act(async () => {
        await result.current.deleteUser('user-123', undefined, sampleUser)
      }),
    ).rejects.toThrow('delete failed')
    expect(mockDispatch).toHaveBeenCalled()
    expect(onError).toHaveBeenCalledWith(err)
    expect(mockLogUserDeletion).not.toHaveBeenCalled()
    expect(mockTriggerUserWebhook).not.toHaveBeenCalled()
    expect(mockInvalidateQueriesByKey).not.toHaveBeenCalled()
  })

  it('continues flow when audit logging fails (does not throw)', async () => {
    mockMutateAsync.mockResolvedValue(undefined)
    mockLogUserDeletion.mockRejectedValue(new Error('audit failed'))
    const onSuccess = jest.fn()
    const { result } = renderHook(() => useDeleteUserWithAudit({ onSuccess }))
    await act(async () => {
      await result.current.deleteUser('user-123', undefined, sampleUser)
    })
    expect(mockTriggerUserWebhook).toHaveBeenCalled()
    expect(mockInvalidateQueriesByKey).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('continues flow when webhook throws (does not throw)', async () => {
    mockMutateAsync.mockResolvedValue(undefined)
    mockTriggerUserWebhook.mockImplementation(() => {
      throw new Error('webhook failed')
    })
    const onSuccess = jest.fn()
    const { result } = renderHook(() => useDeleteUserWithAudit({ onSuccess }))
    await act(async () => {
      await result.current.deleteUser('user-123', undefined, sampleUser)
    })
    expect(mockInvalidateQueriesByKey).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('continues flow when query invalidation fails (does not throw)', async () => {
    mockMutateAsync.mockResolvedValue(undefined)
    mockInvalidateQueriesByKey.mockRejectedValue(new Error('invalidate failed'))
    const onSuccess = jest.fn()
    const { result } = renderHook(() => useDeleteUserWithAudit({ onSuccess }))
    await act(async () => {
      await result.current.deleteUser('user-123', undefined, sampleUser)
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('exposes isLoading reflecting mutation.isPending', () => {
    const { result } = renderHook(() => useDeleteUserWithAudit())
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.error).toBeNull()
  })
})
