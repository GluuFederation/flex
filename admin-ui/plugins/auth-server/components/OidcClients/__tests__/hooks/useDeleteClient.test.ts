import { renderHook, act } from '@testing-library/react'
import { useDeleteClient } from 'Plugins/auth-server/components/OidcClients/hooks/useDeleteClient'
import type { AuditContext } from 'Plugins/auth-server/components/OidcClients/types'

const mockDispatch = jest.fn()
jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: jest.fn((_show, _type, _msg) => ({ type: 'toast/update' })),
}))

const mockMutateAsync = jest.fn()
const mockInvalidateQueriesByKey = jest.fn()

jest.mock('JansConfigApi', () => ({
  useDeleteOauthOpenidClientByInum: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
  getGetOauthOpenidClientsQueryKey: jest.fn(() => ['clients']),
}))

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({}),
}))

jest.mock('@/utils/queryUtils', () => ({
  invalidateQueriesByKey: mockInvalidateQueriesByKey,
}))

jest.mock('Plugins/admin/redux/features/WebhookSlice', () => ({
  triggerWebhook: jest.fn(() => ({ type: 'webhook/trigger' })),
}))

jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: jest.fn().mockResolvedValue(undefined),
}))

const AUDIT_CTX: AuditContext = {
  userinfo: { name: 'Admin', inum: 'user-001' },
  clientId: 'client-001',
}

beforeEach(() => {
  jest.clearAllMocks()
  mockInvalidateQueriesByKey.mockResolvedValue(undefined)
})

describe('useDeleteClient', () => {
  it('deleteClient calls mutateAsync with the correct inum', async () => {
    mockMutateAsync.mockResolvedValue(undefined)
    const { result } = renderHook(() => useDeleteClient(AUDIT_CTX))
    await act(async () => {
      await result.current.deleteClient({ inum: 'client-abc', message: 'Deleted' })
    })
    expect(mockMutateAsync).toHaveBeenCalledWith({ inum: 'client-abc' })
  })

  it('deleteClient dispatches success toast and invalidates query on success', async () => {
    mockMutateAsync.mockResolvedValue(undefined)
    const { result } = renderHook(() => useDeleteClient(AUDIT_CTX))
    await act(async () => {
      await result.current.deleteClient({ inum: 'client-abc', message: 'Deleted' })
    })
    expect(mockDispatch).toHaveBeenCalled()
    expect(mockInvalidateQueriesByKey).toHaveBeenCalled()
  })

  it('deleteClient dispatches error toast and rethrows on failure', async () => {
    mockMutateAsync.mockRejectedValue(new Error('delete failed'))
    const { result } = renderHook(() => useDeleteClient(AUDIT_CTX))
    await expect(
      act(async () => {
        await result.current.deleteClient({ inum: 'client-abc', message: 'Deleted' })
      }),
    ).rejects.toThrow('delete failed')
    expect(mockDispatch).toHaveBeenCalled()
  })

  it('exposes isDeleting from the mutation', () => {
    const { result } = renderHook(() => useDeleteClient(AUDIT_CTX))
    expect(result.current.isDeleting).toBe(false)
  })
})
