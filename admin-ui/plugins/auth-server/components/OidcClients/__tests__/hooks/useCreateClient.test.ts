import { renderHook, act } from '@testing-library/react'
import { useCreateClient } from 'Plugins/auth-server/components/OidcClients/hooks/useCreateClient'
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
  usePostOauthOpenidClient: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
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

describe('useCreateClient', () => {
  it('createClient calls mutateAsync with the client payload', async () => {
    const createdClient = { inum: 'new-client-001', clientName: 'Test' }
    mockMutateAsync.mockResolvedValue(createdClient)
    const { result } = renderHook(() => useCreateClient(AUDIT_CTX))
    await act(async () => {
      await result.current.createClient({
        clientName: 'Test',
        redirectUris: ['https://example.com'],
      } as never)
    })
    expect(mockMutateAsync).toHaveBeenCalledWith({
      data: expect.objectContaining({ clientName: 'Test' }),
    })
  })

  it('createClient dispatches success toast on success', async () => {
    mockMutateAsync.mockResolvedValue({ inum: 'new-001' })
    const { result } = renderHook(() => useCreateClient(AUDIT_CTX))
    await act(async () => {
      await result.current.createClient({ clientName: 'Test', redirectUris: [] } as never)
    })
    expect(mockDispatch).toHaveBeenCalled()
    expect(mockInvalidateQueriesByKey).toHaveBeenCalled()
  })

  it('createClient dispatches error toast and rethrows on failure', async () => {
    mockMutateAsync.mockRejectedValue(new Error('save failed'))
    const { result } = renderHook(() => useCreateClient(AUDIT_CTX))
    await expect(
      act(async () => {
        await result.current.createClient({ clientName: 'Test', redirectUris: [] } as never)
      }),
    ).rejects.toThrow('save failed')
    expect(mockDispatch).toHaveBeenCalled()
  })

  it('exposes isCreating from the mutation', () => {
    const { result } = renderHook(() => useCreateClient(AUDIT_CTX))
    expect(result.current.isCreating).toBe(false)
  })
})
