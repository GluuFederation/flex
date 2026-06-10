import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/utility'
import { CEDAR_ACTIONS } from '@/cedarling/constants'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import type { AdminUiFeatureResource, CedarAction } from '@/cedarling'

const VALID_ACTIONS: CedarAction[] = Object.values(CEDAR_ACTIONS)

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

  it.each(allResources)('%s entries carry the resourceId and a valid action', (resource) => {
    const scopes = CEDAR_RESOURCE_SCOPES[resource]
    scopes.forEach((scope) => {
      expect(scope.resourceId).toBe(resource)
      expect(VALID_ACTIONS).toContain(scope.action)
    })
  })

  it('Lock has read and write actions', () => {
    expect(CEDAR_RESOURCE_SCOPES.Lock.map((s) => s.action)).toEqual(['read', 'write'])
  })

  it('SMTP has read, write, and delete actions', () => {
    expect(CEDAR_RESOURCE_SCOPES.SMTP.map((s) => s.action)).toEqual(['read', 'write', 'delete'])
  })

  it('Dashboard has a single read action', () => {
    expect(CEDAR_RESOURCE_SCOPES.Dashboard.map((s) => s.action)).toEqual(['read'])
  })
})
