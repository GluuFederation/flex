import { enhanceJsonConfigAuditPayload } from 'Plugins/auth-server/redux/utils/auditHelpers'
import type { UserAction } from 'Utils/types'

const ACR_MAPPINGS_PATH = '/acrMappings'
const DEFAULT_RESOURCE = 'OIDC configuration'

type Payload = { action: UserAction }

const makePayload = (action: Partial<UserAction>): Payload => ({
  action: action as UserAction,
})

describe('enhanceJsonConfigAuditPayload', () => {
  it('uses the deleted mapping info to build a delete audit message', () => {
    const payload = makePayload({
      action_data: {
        deletedMapping: { mapping: 'acr_x', source: 'script_y' },
      },
    })
    const result = enhanceJsonConfigAuditPayload(payload, DEFAULT_RESOURCE) as Payload
    expect(result.action.action_message).toBe('Deleted ACR mapping')
    const data = result.action.action_data as {
      performedOn: string
      modifiedFields: Record<string, string>
    }
    expect(data.performedOn).toBe(ACR_MAPPINGS_PATH)
    expect(data.modifiedFields).toEqual({
      mapping: 'acr_x',
      source: 'script_y',
      operation: 'delete',
    })
  })

  it('derives a create message from an add patch on the acrMappings path', () => {
    const payload = makePayload({
      action_data: {
        requestBody: [{ op: 'add', path: ACR_MAPPINGS_PATH, value: { acr_new: 'script_new' } }],
      },
    })
    const result = enhanceJsonConfigAuditPayload(payload, DEFAULT_RESOURCE) as Payload
    expect(result.action.action_message).toBe('Created ACR mapping: acr_new')
    const data = result.action.action_data as { modifiedFields: Record<string, string> }
    expect(data.modifiedFields).toEqual({
      mapping: 'acr_new',
      source: 'script_new',
      operation: 'create',
    })
  })

  it('derives an update message from a replace patch', () => {
    const payload = makePayload({
      action_data: {
        requestBody: [{ op: 'replace', path: ACR_MAPPINGS_PATH, value: { acr_a: 'src_a' } }],
      },
    })
    const result = enhanceJsonConfigAuditPayload(payload, DEFAULT_RESOURCE) as Payload
    expect(result.action.action_message).toBe('Updated ACR mapping: acr_a')
    const data = result.action.action_data as { modifiedFields: Record<string, string> }
    expect(data.modifiedFields.operation).toBe('update')
  })

  it('keeps the user-provided action_message when present', () => {
    const payload = makePayload({
      action_message: 'Custom user message',
      action_data: {
        requestBody: [{ op: 'add', path: ACR_MAPPINGS_PATH, value: { acr_z: 'src_z' } }],
      },
    })
    const result = enhanceJsonConfigAuditPayload(payload, DEFAULT_RESOURCE) as Payload
    expect(result.action.action_message).toBe('Custom user message')
  })

  it('falls back to the default message and resource when there are no relevant patches', () => {
    const payload = makePayload({
      action_data: {
        requestBody: [{ op: 'add', path: '/other', value: { foo: 'bar' } }],
      },
    })
    const result = enhanceJsonConfigAuditPayload(payload, DEFAULT_RESOURCE) as Payload
    expect(result.action.action_message).toBe('Updated JSON configuration')
    const data = result.action.action_data as { performedOn: string }
    expect(data.performedOn).toBe(DEFAULT_RESOURCE)
  })

  it('ignores add patches with no object value', () => {
    const payload = makePayload({
      action_data: {
        requestBody: [{ op: 'add', path: ACR_MAPPINGS_PATH, value: 'not-an-object' }],
      },
    })
    const result = enhanceJsonConfigAuditPayload(payload, DEFAULT_RESOURCE) as Payload
    expect(result.action.action_message).toBe('Updated JSON configuration')
  })

  it('builds a delete message for a remove patch on the acrMappings path', () => {
    const payload = makePayload({
      action_data: {
        requestBody: [{ op: 'remove', path: ACR_MAPPINGS_PATH }],
      },
    })
    const result = enhanceJsonConfigAuditPayload(payload, DEFAULT_RESOURCE) as Payload
    expect(result.action.action_message).toBe('Deleted ACR mapping')
    const data = result.action.action_data as { modifiedFields: Record<string, string> }
    expect(data.modifiedFields.operation).toBe('delete')
  })
})
