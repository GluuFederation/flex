import { CEDAR_RESOURCE_SCOPES, CEDARLING_CONSTANTS } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import type { AdminUiFeatureResource } from '@/cedarling'

describe('CEDAR_RESOURCE_SCOPES', () => {
  const allResources = Object.keys(ADMIN_UI_RESOURCES) as AdminUiFeatureResource[]

  it('has an entry for every AdminUiFeatureResource', () => {
    allResources.forEach((resource) => {
      expect(CEDAR_RESOURCE_SCOPES).toHaveProperty(resource)
    })
  })

  it('has no extra keys beyond AdminUiFeatureResource', () => {
    expect(Object.keys(CEDAR_RESOURCE_SCOPES).sort()).toEqual(allResources.sort())
  })

  it.each(allResources)('%s has non-empty scope entries', (resource) => {
    const scopes = CEDAR_RESOURCE_SCOPES[resource]
    expect(Array.isArray(scopes)).toBe(true)
    expect(scopes.length).toBeGreaterThan(0)
  })

  it.each(allResources)('%s scope entries have correct resourceId', (resource) => {
    const scopes = CEDAR_RESOURCE_SCOPES[resource]
    scopes.forEach((scope) => {
      expect(scope.resourceId).toBe(resource)
      expect(typeof scope.permission).toBe('string')
      expect(scope.permission.length).toBeGreaterThan(0)
    })
  })

  it('Lock has read and write scopes', () => {
    const lockScopes = CEDAR_RESOURCE_SCOPES.Lock
    expect(lockScopes).toHaveLength(2)
    const permissions = lockScopes.map((s) => s.permission)
    expect(permissions.some((p) => p.includes('read') || p.includes('lock'))).toBe(true)
  })

  it('SMTP has read, write, and delete scopes', () => {
    const smtpScopes = CEDAR_RESOURCE_SCOPES.SMTP
    expect(smtpScopes).toHaveLength(3)
  })

  it('Dashboard has stat read scopes', () => {
    const dashScopes = CEDAR_RESOURCE_SCOPES.Dashboard
    expect(dashScopes).toHaveLength(2)
  })
})

describe('CEDARLING_CONSTANTS', () => {
  it('has ACTION_TYPE with correct prefix', () => {
    expect(CEDARLING_CONSTANTS.ACTION_TYPE).toBe('Gluu::Flex::AdminUI::Action::')
  })

  it('has RESOURCE_TYPE with correct value', () => {
    expect(CEDARLING_CONSTANTS.RESOURCE_TYPE).toBe('Gluu::Flex::AdminUI::Resources::Features')
  })
})
