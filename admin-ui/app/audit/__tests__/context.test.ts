import { createSuccessAuditInit, selectAuditContext } from '../context'

describe('audit context helpers', () => {
  it('selectAuditContext maps auth state fields safely', () => {
    const context = selectAuditContext({
      authReducer: {
        config: { clientId: 'client-123' },
        location: { IPv4: '127.0.0.1' },
        userinfo: { inum: 'inum-1', name: 'Alice' },
      },
    } as never)

    expect(context).toEqual({
      client_id: 'client-123',
      ip_address: '127.0.0.1',
      userinfo: { inum: 'inum-1', name: 'Alice' },
    })
  })

  it('selectAuditContext handles absent/null authReducer fields safely', () => {
    const context = selectAuditContext({
      authReducer: { config: {}, location: {}, userinfo: null },
    } as never)

    expect(context).toMatchObject({
      client_id: '',
      ip_address: '',
      userinfo: null,
    })
  })

  it('createSuccessAuditInit creates default performedBy metadata', () => {
    expect(
      createSuccessAuditInit({
        client_id: 'client-123',
        ip_address: '127.0.0.1',
        userinfo: { inum: 'inum-1', name: 'Alice' },
      }),
    ).toEqual({
      client_id: 'client-123',
      ip_address: '127.0.0.1',
      status: 'success',
      performedBy: {
        user_inum: 'inum-1',
        userId: 'Alice',
      },
    })
  })

  it('createSuccessAuditInit supports overriding the displayed user id', () => {
    expect(
      createSuccessAuditInit(
        {
          client_id: '',
          ip_address: '',
          userinfo: { inum: 'inum-1', name: undefined, user_name: 'fallback-user' },
        },
        { userId: 'fallback-user' },
      ),
    ).toEqual({
      client_id: '',
      ip_address: '',
      status: 'success',
      performedBy: {
        user_inum: 'inum-1',
        userId: 'fallback-user',
      },
    })
  })
})
