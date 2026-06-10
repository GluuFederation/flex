import { CEDARLING_CONSTANTS } from '@/cedarling/constants'
import { CEDAR_ACTIONS } from '@/cedarling/constants'
import type { CedarAction } from '@/cedarling'

const EXPECTED_ACTION_STRINGS: Record<CedarAction, string> = {
  read: 'GluuFlexAdminUI::Action::"read"',
  write: 'GluuFlexAdminUI::Action::"write"',
  delete: 'GluuFlexAdminUI::Action::"delete"',
}

describe('CEDARLING_CONSTANTS wire contract', () => {
  it('pins the Cedar action namespace prefix', () => {
    expect(CEDARLING_CONSTANTS.ACTION_TYPE).toBe('GluuFlexAdminUI::Action::')
  })

  it('pins the Cedar resource entity type', () => {
    expect(CEDARLING_CONSTANTS.RESOURCE_TYPE).toBe('GluuFlexAdminUIResources::Features')
  })

  it('builds the exact action string the policy store expects for every action', () => {
    ;(Object.values(CEDAR_ACTIONS) as CedarAction[]).forEach((action) => {
      expect(`${CEDARLING_CONSTANTS.ACTION_TYPE}"${action}"`).toBe(EXPECTED_ACTION_STRINGS[action])
    })
  })

  it('keeps action and resource namespaces under the same application root', () => {
    expect(CEDARLING_CONSTANTS.ACTION_TYPE.startsWith('GluuFlexAdminUI')).toBe(true)
    expect(CEDARLING_CONSTANTS.RESOURCE_TYPE.startsWith('GluuFlexAdminUI')).toBe(true)
  })
})
