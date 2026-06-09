import { ADMIN_UI_RESOURCES, buildCedarPermissionKey } from '@/cedarling/utility/resources'
import { CEDARLING_BYPASS } from '@/cedarling/constants'
import type { AdminUiFeatureResource } from '@/cedarling'

describe('CEDARLING_BYPASS', () => {
  it('equals "CEDARLING_BYPASS"', () => {
    expect(CEDARLING_BYPASS).toBe('CEDARLING_BYPASS')
  })
})

describe('ADMIN_UI_RESOURCES', () => {
  const expectedResources: AdminUiFeatureResource[] = [
    'Dashboard',
    'License',
    'MAU',
    'Security',
    'Settings',
    'Webhooks',
    'Assets',
    'AuditLogs',
    'Clients',
    'Scopes',
    'Keys',
    'AuthenticationServerConfiguration',
    'Logging',
    'SSA',
    'Authentication',
    'ConfigApiConfiguration',
    'Session',
    'Users',
    'Scripts',
    'Attributes',
    'Cache',
    'Persistence',
    'SMTP',
    'SCIM',
    'FIDO',
    'SAML',
    'Lock',
  ]

  it('contains all expected resources', () => {
    expect(Object.keys(ADMIN_UI_RESOURCES)).toHaveLength(expectedResources.length)
  })

  it.each(expectedResources)('has resource "%s" with matching key and value', (resource) => {
    expect(ADMIN_UI_RESOURCES[resource]).toBe(resource)
  })
})

describe('buildCedarPermissionKey', () => {
  it('builds key with resourceId and action', () => {
    expect(buildCedarPermissionKey('Dashboard', 'read')).toBe('Dashboard::read')
  })

  it('builds key for write action', () => {
    expect(buildCedarPermissionKey('Users', 'write')).toBe('Users::write')
  })

  it('builds key for delete action', () => {
    expect(buildCedarPermissionKey('Scripts', 'delete')).toBe('Scripts::delete')
  })

  it('builds key for complex resource name', () => {
    expect(buildCedarPermissionKey('AuthenticationServerConfiguration', 'write')).toBe(
      'AuthenticationServerConfiguration::write',
    )
  })
})
