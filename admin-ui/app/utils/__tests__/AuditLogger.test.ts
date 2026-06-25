import { logAuditUserAction } from '../AuditLogger'
import { postUserAction } from 'Redux/api/backend-api'

jest.mock('Redux/api/backend-api')

const mockedPostUserAction = postUserAction as jest.MockedFunction<typeof postUserAction>

describe('logAuditUserAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedPostUserAction.mockResolvedValue({} as never)
  })

  it('builds a performedBy block from the user info and posts the action', async () => {
    await logAuditUserAction({
      userinfo: { inum: 'inum-1', name: 'alice' } as never,
      action: 'CREATE',
      resource: '/api/v1/users',
      message: 'created user',
    })

    expect(mockedPostUserAction).toHaveBeenCalledTimes(1)
    const audit = mockedPostUserAction.mock.calls[0][0] as Record<string, never>
    expect(audit.action).toBe('CREATE')
    expect(audit.resource).toBe('/api/v1/users')
    expect(audit.performedBy).toEqual({ user_inum: 'inum-1', userId: 'alice' })
    expect(audit.status).toBe('success')
  })

  it('falls back to placeholders when user info is missing', async () => {
    await logAuditUserAction({ action: 'FETCH', resource: '/r' } as never)

    const audit = mockedPostUserAction.mock.calls[0][0] as Record<string, never>
    expect(audit.performedBy).toEqual({ user_inum: '-', userId: '-' })
  })

  it('uses an explicit error status when provided', async () => {
    await logAuditUserAction({ action: 'CREATE', resource: '/r', status: 'error' } as never)

    const audit = mockedPostUserAction.mock.calls[0][0] as Record<string, never>
    expect(audit.status).toBe('error')
  })
})
