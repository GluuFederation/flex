import { renderHook, act } from '@testing-library/react'
import type { Client } from 'JansConfigApi'
import type { LogAuditParams } from 'Utils/AuditLogger'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { useUpdateClient } from 'Plugins/auth-server/components/OidcClients/hooks/useUpdateClient'
import type {
  AuditContext,
  ClientWizardSubmitData,
} from 'Plugins/auth-server/components/OidcClients/types'

const mockDispatch = jest.fn()
const mockMutateAsync = jest.fn()
const mockLogAuditUserAction = jest.fn()
const mockInvalidateQueriesByKey = jest.fn()
const mockLoggerError = jest.fn()
const mockSetQueryData = jest.fn()
const mockUpdateToast = jest.fn((show: boolean, type: string, msg?: string) => ({
  type: 'toast',
  payload: { show, type, msg },
}))
type WebhookPayload = {
  createdFeatureValue: Record<string, JsonValue>
  feature: string
}
const mockTriggerWebhook = jest.fn((payload: WebhookPayload) => ({ type: 'webhook', payload }))

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ setQueryData: mockSetQueryData }),
}))

jest.mock('JansConfigApi', () => ({
  usePutOauthOpenidClient: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
  getGetOauthOpenidClientsQueryKey: () => ['oidc', 'clients'],
  getGetOauthOpenidClientsByInumQueryKey: (inum: string) => ['oidc', 'clients', inum],
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: (show: boolean, type: string, msg?: string) => mockUpdateToast(show, type, msg),
}))

jest.mock('Plugins/admin/redux/features/WebhookSlice', () => ({
  triggerWebhook: (payload: WebhookPayload) => mockTriggerWebhook(payload),
}))

jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: (params: LogAuditParams) => mockLogAuditUserAction(params),
}))

jest.mock('@/utils/queryUtils', () => ({
  invalidateQueriesByKey: (queryClient: object, key: readonly string[]) =>
    mockInvalidateQueriesByKey(queryClient, key),
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    error: (message: string, detail: Error | string) => mockLoggerError(message, detail),
  },
}))

const auditContext: AuditContext = {
  userinfo: { inum: 'inum-123', name: 'admin' },
  clientId: 'client-1',
}

const updatedClient: Client = { inum: 'client-inum-1', displayName: 'My Client' }

const buildFormData = (): ClientWizardSubmitData =>
  ({
    inum: 'client-inum-1',
    displayName: 'My Client',
    action_message: 'updated client',
    modifiedFields: { displayName: 'My Client' },
  }) as ClientWizardSubmitData

describe('useUpdateClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMutateAsync.mockResolvedValue(updatedClient)
    mockInvalidateQueriesByKey.mockResolvedValue(undefined)
    mockLogAuditUserAction.mockResolvedValue(undefined)
  })

  it('exposes updateClient and isUpdating', () => {
    const { result } = renderHook(() => useUpdateClient(auditContext))
    expect(typeof result.current.updateClient).toBe('function')
    expect(result.current.isUpdating).toBe(false)
  })

  it('mutates with the client payload and returns the updated client', async () => {
    const { result } = renderHook(() => useUpdateClient(auditContext))

    let returned: Client | undefined
    await act(async () => {
      returned = await result.current.updateClient(buildFormData())
    })

    expect(mockMutateAsync).toHaveBeenCalledWith({
      data: { inum: 'client-inum-1', displayName: 'My Client' },
    })
    expect(returned).toEqual(updatedClient)
  })

  it('dispatches a success toast, invalidates queries and triggers a webhook', async () => {
    const { result } = renderHook(() => useUpdateClient(auditContext))

    await act(async () => {
      await result.current.updateClient(buildFormData())
    })

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'success', undefined)
    expect(mockInvalidateQueriesByKey).toHaveBeenCalled()
    expect(mockTriggerWebhook).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalled()
  })

  it('logs an audit action with the expected shape', async () => {
    const { result } = renderHook(() => useUpdateClient(auditContext))

    await act(async () => {
      await result.current.updateClient(buildFormData())
    })

    expect(mockLogAuditUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'UPDATE',
        resource: '/openid/clients',
        message: 'updated client',
        modifiedFields: { displayName: 'My Client' },
        performedOn: 'client-inum-1',
        client_id: 'client-1',
        userinfo: { inum: 'inum-123', name: 'admin' },
      }),
    )
  })

  it('logs an error but still resolves when audit logging fails', async () => {
    const failure = new Error('audit boom')
    mockLogAuditUserAction.mockRejectedValueOnce(failure)
    const { result } = renderHook(() => useUpdateClient(auditContext))

    let returned: Client | undefined
    await act(async () => {
      returned = await result.current.updateClient(buildFormData())
    })

    expect(mockLoggerError).toHaveBeenCalledWith('Audit logging failed:', failure)
    expect(returned).toEqual(updatedClient)
  })

  it('dispatches an error toast and rethrows when the mutation fails', async () => {
    const failure = new Error('mutation failed')
    mockMutateAsync.mockRejectedValueOnce(failure)
    const { result } = renderHook(() => useUpdateClient(auditContext))

    await act(async () => {
      await expect(result.current.updateClient(buildFormData())).rejects.toThrow('mutation failed')
    })

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'error', 'mutation failed')
  })
})
