import { renderHook, act } from '@testing-library/react'
import { useAssetAudit } from '../useAssetAudit'
import type { AssetAuditLogActionPayload } from '../../types'
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

describe('useAssetAudit', () => {
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
    const { result } = renderHook(() => useAssetAudit())
    expect(typeof result.current.initAudit).toBe('function')
    expect(typeof result.current.logAction).toBe('function')
  })

  it('initAudit returns the success audit init shape', () => {
    const { result } = renderHook(() => useAssetAudit())
    const audit = result.current.initAudit()
    expect(audit).toEqual(
      expect.objectContaining({
        client_id: 'client-1',
        status: 'success',
        performedBy: { user_inum: 'inum-1', userId: 'admin' },
      }),
    )
  })

  it('adds additional data with sanitized action data and posts the audit', async () => {
    const { result } = renderHook(() => useAssetAudit())
    const payload: AssetAuditLogActionPayload = {
      action_message: 'created asset',
      action_data: { fileName: 'logo.png', enabled: true },
    }

    await act(async () => {
      await result.current.logAction('CREATE', 'asset', payload)
    })

    expect(mockAddAdditionalData).toHaveBeenCalledTimes(1)
    expect(mockAddAdditionalData).toHaveBeenCalledWith(expect.any(Object), 'CREATE', 'asset', {
      action: {
        action_message: 'created asset',
        action_data: { fileName: 'logo.png', enabled: true },
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
        resource: 'asset',
        action: {
          action_message: 'created asset',
          action_data: { fileName: 'logo.png', enabled: true },
        },
      }),
    )
  })

  it('truncates long strings in action data', async () => {
    const { result } = renderHook(() => useAssetAudit())
    const longString = 'x'.repeat(600)

    await act(async () => {
      await result.current.logAction('CREATE', 'asset', {
        action_data: { description: longString },
      })
    })

    const additionalDataCall = mockAddAdditionalData.mock.calls[0]
    const actionData = additionalDataCall[3].action.action_data
    expect(actionData.description).toContain('... [truncated]')
    expect(actionData.description.length).toBeLessThan(longString.length)
  })

  it('sanitizes File values into a descriptor object', async () => {
    const { result } = renderHook(() => useAssetAudit())
    const file = new File(['abc'], 'photo.png', { type: 'image/png' })

    await act(async () => {
      await result.current.logAction('CREATE', 'asset', {
        action_data: { document: file },
      })
    })

    const actionData = mockAddAdditionalData.mock.calls[0][3].action.action_data
    expect(actionData.document).toEqual(
      expect.objectContaining({ type: 'file', name: 'photo.png' }),
    )
  })

  it('passes undefined action_data when payload has none', async () => {
    const { result } = renderHook(() => useAssetAudit())

    await act(async () => {
      await result.current.logAction('UPDATE', 'asset', { action_message: 'no data' })
    })

    const actionArg = mockAddAdditionalData.mock.calls[0][3].action
    expect(actionArg.action_data).toBeUndefined()
  })

  it('logs an error and does not throw when postUserAction rejects', async () => {
    const failure = new Error('post failed')
    mockPostUserAction.mockRejectedValueOnce(failure)
    const { result } = renderHook(() => useAssetAudit())

    await act(async () => {
      await expect(
        result.current.logAction('DELETION', 'asset', { action_data: { inum: 'a-1' } }),
      ).resolves.toBeUndefined()
    })

    expect(mockLoggerError).toHaveBeenCalledTimes(1)
    expect(mockLoggerError).toHaveBeenCalledWith('[Asset audit] postUserAction failed', failure)
  })
})
