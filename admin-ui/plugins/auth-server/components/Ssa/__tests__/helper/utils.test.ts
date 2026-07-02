import type { SsaFormValues } from 'Plugins/auth-server/components/Ssa/types'

type AuditCall = {
  action: string
  resource: string
  message: string
  client_id: string
  payload: Record<string, string | number | boolean | null>
}

// Collaborators have their own suites; stub them so the assertions target this
// helper's payload assembly, audit action selection, and error handling.
const mockLogAudit = jest.fn()
jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: (payload: AuditCall) => mockLogAudit(payload),
}))

jest.mock('@/audit', () => ({
  getCurrentAuditContext: () => ({ client_id: 'client-1', userinfo: { sub: 'admin' } }),
}))

const mockResolve = jest.fn((e: Error) => e.message)
jest.mock('@/utils/apiErrorMessage', () => ({
  resolveApiErrorMessage: (e: Error) => mockResolve(e),
}))

const mockLoggerError = jest.fn()
jest.mock('@/utils/logger', () => ({
  logger: { error: (m: string, d?: string) => mockLoggerError(m, d) },
}))

jest.mock('Plugins/auth-server/redux/audit/Resources', () => ({ SSA: 'ssa' }))

import {
  logSsaCreation,
  logSsaDeletion,
  getErrorMessage,
} from 'Plugins/auth-server/components/Ssa/helper/utils'

const lastAudit = (): AuditCall => mockLogAudit.mock.calls[0][0] as AuditCall

beforeEach(() => {
  mockLogAudit.mockReset().mockResolvedValue(undefined)
  mockResolve.mockClear()
  mockLoggerError.mockReset()
})

const baseForm = {
  software_id: 'sw-1',
  one_time_use: true,
  org_id: 'org-1',
  description: 'a description',
  software_roles: ['role'],
  rotate_ssa: true,
  grant_types: ['authorization_code'],
  is_expirable: false,
  expirationDate: null,
} as object as SsaFormValues

describe('logSsaCreation', () => {
  it('logs a CREATE action with the serialized payload', async () => {
    await logSsaCreation(baseForm)
    const call = lastAudit()
    expect(call.action).toBe('CREATE')
    expect(call.resource).toBe('ssa')
    expect(call.client_id).toBe('client-1')
    expect(call.payload).toMatchObject({ software_id: 'sw-1', org_id: 'org-1' })
  })

  it('serializes an expiration date to an ISO string', async () => {
    const withDate = {
      ...baseForm,
      is_expirable: true,
      expirationDate: new Date('2030-01-02T03:04:05.000Z'),
    } as object as SsaFormValues
    await logSsaCreation(withDate)
    expect(lastAudit().payload.expirationDate).toBe('2030-01-02T03:04:05.000Z')
  })

  it('uses a custom message when provided', async () => {
    await logSsaCreation(baseForm, 'custom message')
    expect(lastAudit().message).toBe('custom message')
  })

  it('swallows and logs errors from the audit logger', async () => {
    mockLogAudit.mockRejectedValueOnce(new Error('audit down'))
    await expect(logSsaCreation(baseForm)).resolves.toBeUndefined()
    expect(mockLoggerError).toHaveBeenCalledWith('Failed to log SSA creation:', 'audit down')
  })
})

describe('logSsaDeletion', () => {
  it('logs a DELETION action carrying the jti', async () => {
    await logSsaDeletion('jti-123', { software_id: 'sw-1' })
    const call = lastAudit()
    expect(call.action).toBe('DELETION')
    expect(call.payload).toMatchObject({ jti: 'jti-123', software_id: 'sw-1' })
  })

  it('defaults the payload to just the jti when none is provided', async () => {
    await logSsaDeletion('jti-999')
    expect(lastAudit().payload).toEqual({ jti: 'jti-999' })
  })

  it('swallows and logs deletion audit errors', async () => {
    mockLogAudit.mockRejectedValueOnce(new Error('nope'))
    await expect(logSsaDeletion('jti-1')).resolves.toBeUndefined()
    expect(mockLoggerError).toHaveBeenCalledWith('Failed to log SSA deletion:', 'nope')
  })
})

describe('getErrorMessage', () => {
  it('delegates to resolveApiErrorMessage', () => {
    expect(getErrorMessage(new Error('resolved'))).toBe('resolved')
    expect(mockResolve).toHaveBeenCalled()
  })
})
