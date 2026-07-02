import type { CustomUser } from 'Plugins/user-management/types'

// Collaborators have their own suites; stub them so the assertions target this
// helper's redaction, audit action selection, and webhook wiring.
type AuditRecord = {
  action: string
  resource: string
  message: string
  payload: CustomUser & { userPassword?: string; jsonPatchString?: string; inum?: string }
}
const mockLogAudit = jest.fn()
jest.mock('Utils/AuditLogger', () => ({
  logAuditUserAction: (record: AuditRecord) => mockLogAudit(record),
}))

jest.mock('@/audit', () => ({
  getCurrentAuditContext: () => ({ client_id: 'client-1', userinfo: { sub: 'admin' } }),
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETION: 'DELETION',
}))

jest.mock('@/utils/apiErrorMessage', () => ({
  resolveApiErrorMessage: (e: Error) => `resolved:${e.message}`,
}))

const mockTriggerWebhook = jest.fn()
jest.mock('@/utils/triggerWebhookForFeature', () => ({
  triggerWebhookForFeature: (data: Record<string, string>, feature: string) =>
    mockTriggerWebhook(data, feature),
}))

const mockLoggerError = jest.fn()
jest.mock('@/utils/logger', () => ({ logger: { error: (m: string) => mockLoggerError(m) } }))

import {
  logUserCreation,
  logUserUpdate,
  logUserDeletion,
  logPasswordChange,
  getErrorMessage,
  triggerUserWebhook,
} from 'Plugins/user-management/helper/utils'
import { adminUiFeatures } from '@/constants'

const lastAudit = (): AuditRecord => mockLogAudit.mock.calls[0][0] as AuditRecord

beforeEach(() => {
  mockLogAudit.mockReset().mockResolvedValue(undefined)
  mockTriggerWebhook.mockReset()
  mockLoggerError.mockReset()
})

describe('logUserCreation', () => {
  it('logs a CREATE action and redacts the password', async () => {
    await logUserCreation(
      {} as CustomUser,
      {
        userId: 'jdoe',
        userPassword: 'secret',
      } as CustomUser,
    )
    const call = lastAudit()
    expect(call.action).toBe('CREATE')
    expect(call.payload.userPassword).toBe('[REDACTED]')
  })

  it('redacts sensitive custom attribute values', async () => {
    await logUserCreation(
      {} as CustomUser,
      {
        customAttributes: [{ name: 'userPassword', values: ['secret'] }],
      } as object as CustomUser,
    )
    const attr = lastAudit().payload.customAttributes?.[0]
    expect(attr?.values).toEqual([{ value: '[REDACTED]' }])
  })

  it('swallows and logs audit errors', async () => {
    mockLogAudit.mockRejectedValueOnce(new Error('down'))
    await expect(logUserCreation({} as CustomUser, {} as CustomUser)).resolves.toBeUndefined()
    expect(mockLoggerError).toHaveBeenCalledWith('Failed to log user creation:')
  })
})

describe('logUserUpdate', () => {
  it('logs an UPDATE action', async () => {
    await logUserUpdate({} as CustomUser, { userId: 'jdoe' } as CustomUser)
    expect(lastAudit().action).toBe('UPDATE')
  })
})

describe('logUserDeletion', () => {
  it('logs a DELETION action carrying the inum', async () => {
    await logUserDeletion('inum-1', { userId: 'jdoe' } as CustomUser)
    const call = lastAudit()
    expect(call.action).toBe('DELETION')
    expect(call.payload.inum).toBe('inum-1')
  })
})

describe('logPasswordChange', () => {
  it('logs an UPDATE action and rewrites a json patch string', async () => {
    await logPasswordChange('inum-1', {
      jsonPatchString: '[{"op":"replace","path":"/userPassword","value":"secret"}]',
    })
    const call = lastAudit()
    expect(call.action).toBe('UPDATE')
    expect(call.payload.jsonPatchString).toContain('[REDACTED]')
  })
})

describe('getErrorMessage', () => {
  it('delegates to resolveApiErrorMessage', () => {
    expect(getErrorMessage(new Error('oops'))).toBe('resolved:oops')
  })
})

describe('triggerUserWebhook', () => {
  it('triggers the default users_edit feature', () => {
    triggerUserWebhook({ userId: 'jdoe' } as CustomUser)
    expect(mockTriggerWebhook).toHaveBeenCalledWith({ userId: 'jdoe' }, 'users_edit')
  })

  it('honours an explicit feature key', () => {
    triggerUserWebhook({ userId: 'jdoe' } as CustomUser, adminUiFeatures.users_delete)
    expect(mockTriggerWebhook).toHaveBeenCalledWith({ userId: 'jdoe' }, 'users_delete')
  })
})
