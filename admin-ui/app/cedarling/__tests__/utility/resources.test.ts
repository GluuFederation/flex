import {
  ADMIN_UI_RESOURCES,
  findPermissionByUrl,
  buildCedarPermissionKey,
  CEDARLING_BYPASS,
} from '@/cedarling/utility/resources'
import type { AdminUiFeatureResource, ApiPermissionType } from '@/cedarling'

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

  it('contains all 27 resources', () => {
    expect(Object.keys(ADMIN_UI_RESOURCES)).toHaveLength(27)
  })

  it.each(expectedResources)('has resource "%s" with matching key and value', (resource) => {
    expect(ADMIN_UI_RESOURCES[resource]).toBe(resource)
  })
})

describe('findPermissionByUrl', () => {
  const permissions: ApiPermissionType[] = [
    { permission: 'https://example.com/read', tag: 'read-tag' },
    { permission: 'https://example.com/write', tag: 'write-tag' },
    { permission: 'https://example.com/delete', tag: 'delete-tag' },
  ]

  it('finds matching permission by url', () => {
    const result = findPermissionByUrl(permissions, 'https://example.com/read')
    expect(result).toEqual({ permission: 'https://example.com/read', tag: 'read-tag' })
  })

  it('returns undefined for non-matching url', () => {
    const result = findPermissionByUrl(permissions, 'https://example.com/unknown')
    expect(result).toBeUndefined()
  })

  it('returns undefined for empty permissions array', () => {
    const result = findPermissionByUrl([], 'https://example.com/read')
    expect(result).toBeUndefined()
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
