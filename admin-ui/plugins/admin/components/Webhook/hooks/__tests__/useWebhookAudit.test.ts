import { renderHook, act } from '@testing-library/react'
import { useWebhookAudit } from '../useWebhookAudit'
import type { WebhookAuditLogActionPayload } from '../../types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

const mockPostUserAction = jest.fn()
const mockAddAdditionalData = jest.fn()
const mockLoggerError = jest.fn()

jest.mock('Redux/api/backend-api', () => ({
  postUserAction: (payload: object) => mockPostUserAction(payload),
}))

type AuditAccumulator = Record<string, JsonValue>

jest.mock('Utils/TokenController', () => ({
  addAdditionalData: (
    audit: AuditAccumulator,
    actionType: string,
    resource: string,
    extra: object,
  ) => mockAddAdditionalData(audit, actionType, resource, extra),
}))

jest.mock('@/audit', () => ({
  useAuditContext: jest.fn(() => ({
    client_id: 'client-1',
    ip_address: '127.0.0.1',
    userinfo: { inum: 'inum-1', name: 'admin' },
  })),
  createSuccessAuditInit: jest.fn(() => ({
    client_id: 'client-1',
    ip_address: '127.0.0.1',
    status: 'success',
    performedBy: { user_inum: 'inum-1', userId: 'admin' },
  })),
}))

jest.mock('@/utils/logger', () => ({
  logger: {
    error: (message: string, detail: Error | string) => mockLoggerError(message, detail),
  },
}))

describe('useWebhookAudit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPostUserAction.mockResolvedValue(undefined)
    // Mirror the real addAdditionalData, which enriches the audit object in
    // place (action type/resource/payload) before it is posted.
    mockAddAdditionalData.mockImplementation(
      (audit: AuditAccumulator, actionType: string, resource: string, extra: AuditAccumulator) => {
        audit.action_type = actionType
        audit.resource = resource
        audit.action = extra.action
      },
    )
  })

  it('exposes initAudit and logAction functions', () => {
    const { result } = renderHook(() => useWebhookAudit())
    expect(typeof result.current.initAudit).toBe('function')
    expect(typeof result.current.logAction).toBe('function')
  })

  it('initAudit returns the success audit init shape', () => {
    const { result } = renderHook(() => useWebhookAudit())
    const audit = result.current.initAudit()
    expect(audit).toEqual(
      expect.objectContaining({
        client_id: 'client-1',
        status: 'success',
        performedBy: { user_inum: 'inum-1', userId: 'admin' },
      }),
    )
  })

  it('adds additional data with the provided payload and posts the audit', async () => {
    const { result } = renderHook(() => useWebhookAudit())
    const payload: WebhookAuditLogActionPayload = {
      action_message: 'created webhook',
      action_data: { displayName: 'hook', url: 'https://example.com' },
    }

    await act(async () => {
      await result.current.logAction('CREATE', 'webhook', payload)
    })

    expect(mockAddAdditionalData).toHaveBeenCalledTimes(1)
    expect(mockAddAdditionalData).toHaveBeenCalledWith(expect.any(Object), 'CREATE', 'webhook', {
      action: {
        action_message: 'created webhook',
        action_data: { displayName: 'hook', url: 'https://example.com' },
      },
    })
    expect(mockPostUserAction).toHaveBeenCalledTimes(1)
    // The posted object must be the audit AFTER enrichment, not the bare init.
    expect(mockPostUserAction).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: 'client-1',
        status: 'success',
        performedBy: { user_inum: 'inum-1', userId: 'admin' },
        action_type: 'CREATE',
        resource: 'webhook',
        action: {
          action_message: 'created webhook',
          action_data: { displayName: 'hook', url: 'https://example.com' },
        },
      }),
    )
  })

  it('logs an error and does not throw when postUserAction rejects', async () => {
    const failure = new Error('post failed')
    mockPostUserAction.mockRejectedValueOnce(failure)
    const { result } = renderHook(() => useWebhookAudit())

    await act(async () => {
      await expect(
        result.current.logAction('DELETION', 'webhook', { action_data: { inum: 'w-1' } }),
      ).resolves.toBeUndefined()
    })

    expect(mockLoggerError).toHaveBeenCalledTimes(1)
    expect(mockLoggerError).toHaveBeenCalledWith('[Webhook audit] postUserAction failed', failure)
  })
})
