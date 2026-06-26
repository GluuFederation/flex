import { logAuditUserAction } from '@/utils/AuditLogger'
import { addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'

jest.mock('Utils/TokenController', () => ({
  addAdditionalData: jest.fn(),
}))

jest.mock('Redux/api/backend-api', () => ({
  postUserAction: jest.fn().mockResolvedValue(undefined),
}))

const mockedAddAdditionalData = addAdditionalData as jest.Mock
const mockedPostUserAction = postUserAction as jest.Mock

describe('logAuditUserAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('builds the audit base record with the user identity', async () => {
    await logAuditUserAction({
      userinfo: { inum: 'inum-1', name: 'admin' },
      action: 'update',
      resource: 'client',
      message: 'updated client',
    })
    const [audit] = mockedAddAdditionalData.mock.calls[0]
    expect(audit.status).toBe('success')
    expect(audit.performedBy).toEqual({ user_inum: 'inum-1', userId: 'admin' })
  })

  it('defaults missing user identity fields to a dash', async () => {
    await logAuditUserAction({
      userinfo: null,
      action: 'create',
      resource: 'scope',
      message: 'created scope',
    })
    const [audit] = mockedAddAdditionalData.mock.calls[0]
    expect(audit.performedBy).toEqual({ user_inum: '-', userId: '-' })
  })

  it('forwards the action and resource to addAdditionalData', async () => {
    await logAuditUserAction({
      action: 'delete',
      resource: 'user',
      message: 'deleted user',
    })
    const [, action, resource] = mockedAddAdditionalData.mock.calls[0]
    expect(action).toBe('delete')
    expect(resource).toBe('user')
  })

  it('wraps message and derived action_data into the payload action', async () => {
    await logAuditUserAction({
      action: 'update',
      resource: 'client',
      message: 'changed name',
      modifiedFields: { name: 'new' },
      performedOn: 'client-123',
      extra: { source: 'ui' },
    })
    const [, , , wrapper] = mockedAddAdditionalData.mock.calls[0]
    expect(wrapper.action.action_message).toBe('changed name')
    expect(wrapper.action.action_data).toEqual({
      source: 'ui',
      modifiedFields: { name: 'new' },
      performedOn: 'client-123',
    })
  })

  it('uses an explicit object payload as the action data', async () => {
    await logAuditUserAction({
      action: 'update',
      resource: 'client',
      message: 'raw payload',
      payload: { custom: 'data' },
    })
    const [, , , wrapper] = mockedAddAdditionalData.mock.calls[0]
    expect(wrapper.action.action_data).toEqual({ custom: 'data' })
  })

  it('ignores a non-object payload and falls back to the derived data', async () => {
    await logAuditUserAction({
      action: 'update',
      resource: 'client',
      message: 'string payload',
      payload: 'just-a-string',
    })
    const [, , , wrapper] = mockedAddAdditionalData.mock.calls[0]
    expect(wrapper.action.action_data).toEqual({ modifiedFields: {} })
  })

  it('passes a custom status through to the audit record', async () => {
    await logAuditUserAction({
      action: 'update',
      resource: 'client',
      message: 'failed update',
      status: 'failure',
    })
    const [audit] = mockedAddAdditionalData.mock.calls[0]
    expect(audit.status).toBe('failure')
  })

  it('posts the assembled audit record', async () => {
    await logAuditUserAction({
      action: 'update',
      resource: 'client',
      message: 'posted',
      client_id: 'cid-1',
    })
    expect(mockedPostUserAction).toHaveBeenCalledTimes(1)
    const [posted] = mockedPostUserAction.mock.calls[0]
    expect(posted.client_id).toBe('cid-1')
  })
})
