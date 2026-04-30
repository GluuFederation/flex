import {
  toScopeJsonRecord,
  buildScopeInitialValues,
  derivePanelVisibility,
  applyScopeTypeDefaults,
  hasActualChanges,
  buildScopeChangedFieldOperations,
} from 'Plugins/auth-server/components/Scopes/helper/utils'
import type { ExtendedScope, ScopeFormValues } from 'Plugins/auth-server/components/Scopes/types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const openidScope: ExtendedScope = {
  inum: 'F0C4',
  dn: 'inum=F0C4,ou=scopes,o=jans',
  id: 'openid',
  displayName: 'OpenID Connect',
  description: 'Authenticate using OpenID Connect.',
  scopeType: 'openid',
  defaultScope: true,
  attributes: { showInConfigurationEndpoint: true },
  umaType: false,
  claims: ['inum=2B29,ou=attributes,o=jans'],
  clients: [],
}

const umaScope: ExtendedScope = {
  inum: '8CAD-B06D',
  dn: 'inum=8CAD-B06D,ou=scopes,o=jans',
  id: 'https://example.com/scopes/scim_access',
  displayName: 'SCIM Access',
  scopeType: 'uma',
  umaAuthorizationPolicies: ['inum=2DAF-F9A5,ou=scripts,o=jans'],
  iconUrl: 'https://example.com/icon.png',
  attributes: { showInConfigurationEndpoint: true },
  umaType: true,
  clients: [],
}

const t = (key: string) => key

// ---------------------------------------------------------------------------
// toScopeJsonRecord
// ---------------------------------------------------------------------------

describe('toScopeJsonRecord', () => {
  it('should JSON-clone a scope into a plain record', () => {
    const result = toScopeJsonRecord(openidScope)
    expect(result).toEqual(JSON.parse(JSON.stringify(openidScope)))
  })

  it('should produce an independent copy (mutations do not affect original)', () => {
    const result = toScopeJsonRecord(openidScope)
    result.id = 'mutated'
    expect(openidScope.id).toBe('openid')
  })
})

// ---------------------------------------------------------------------------
// buildScopeInitialValues
// ---------------------------------------------------------------------------

describe('buildScopeInitialValues', () => {
  it('should build initial values from an openid scope', () => {
    const values = buildScopeInitialValues(openidScope)
    expect(values.id).toBe('openid')
    expect(values.displayName).toBe('OpenID Connect')
    expect(values.description).toBe('Authenticate using OpenID Connect.')
    expect(values.scopeType).toBe('openid')
    expect(values.defaultScope).toBe(true)
    expect(values.action_message).toBe('')
  })

  it('should clone the claims array independently', () => {
    const values = buildScopeInitialValues(openidScope)
    values.claims?.push('new-claim')
    expect(openidScope.claims).toHaveLength(1)
  })

  it('should produce empty arrays for absent optional fields', () => {
    const minimalScope: ExtendedScope = {
      inum: 'MIN-001',
      id: 'minimal',
      scopeType: 'oauth',
      umaType: false,
      clients: [],
    }
    const values = buildScopeInitialValues(minimalScope)
    expect(values.claims).toEqual([])
    expect(values.dynamicScopeScripts).toEqual([])
    expect(values.umaAuthorizationPolicies).toEqual([])
  })

  it('should default id to empty string when absent', () => {
    const scopeNoId: ExtendedScope = { ...openidScope, id: undefined }
    const values = buildScopeInitialValues(scopeNoId)
    expect(values.id).toBe('')
  })
})

// ---------------------------------------------------------------------------
// derivePanelVisibility
// ---------------------------------------------------------------------------

describe('derivePanelVisibility', () => {
  it('should show claims panel only for openid scope', () => {
    const vis = derivePanelVisibility('openid')
    expect(vis.showClaimsPanel).toBe(true)
    expect(vis.showDynamicPanel).toBe(false)
    expect(vis.showSpontaneousPanel).toBe(false)
    expect(vis.showUmaPanel).toBe(false)
  })

  it('should show dynamic panel only for dynamic scope', () => {
    const vis = derivePanelVisibility('dynamic')
    expect(vis.showClaimsPanel).toBe(false)
    expect(vis.showDynamicPanel).toBe(true)
  })

  it('should show UMA panel only for uma scope', () => {
    const vis = derivePanelVisibility('uma')
    expect(vis.showUmaPanel).toBe(true)
    expect(vis.showClaimsPanel).toBe(false)
  })

  it('should show spontaneous panel only for spontaneous scope', () => {
    const vis = derivePanelVisibility('spontaneous')
    expect(vis.showSpontaneousPanel).toBe(true)
  })

  it('should show no panels for oauth scope', () => {
    const vis = derivePanelVisibility('oauth')
    expect(vis.showClaimsPanel).toBe(false)
    expect(vis.showDynamicPanel).toBe(false)
    expect(vis.showSpontaneousPanel).toBe(false)
    expect(vis.showUmaPanel).toBe(false)
  })

  it('should handle undefined scopeType gracefully', () => {
    const vis = derivePanelVisibility(undefined)
    expect(vis.showClaimsPanel).toBe(false)
    expect(vis.showUmaPanel).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// applyScopeTypeDefaults
// ---------------------------------------------------------------------------

describe('applyScopeTypeDefaults', () => {
  it('should reset claims and dynamicScopeScripts when changing scope type', () => {
    const initial = buildScopeInitialValues(openidScope)
    const updated = applyScopeTypeDefaults(initial, 'oauth')
    expect(updated.claims).toEqual([])
    expect(updated.dynamicScopeScripts).toEqual([])
    expect(updated.scopeType).toBe('oauth')
  })

  it('should clear spontaneous client attributes', () => {
    const initial: ScopeFormValues = {
      ...buildScopeInitialValues(openidScope),
      attributes: {
        showInConfigurationEndpoint: true,
        spontaneousClientId: 'some-client-id',
        spontaneousClientScopes: ['scope1'],
      },
    }
    const updated = applyScopeTypeDefaults(initial, 'dynamic')
    expect(updated.attributes?.spontaneousClientId).toBeUndefined()
    expect(updated.attributes?.spontaneousClientScopes).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// hasActualChanges
// ---------------------------------------------------------------------------

describe('hasActualChanges', () => {
  it('should return false when values are identical', () => {
    const initial = buildScopeInitialValues(openidScope)
    const current = buildScopeInitialValues(openidScope)
    expect(hasActualChanges(current, initial)).toBe(false)
  })

  it('should return true when displayName changes', () => {
    const initial = buildScopeInitialValues(openidScope)
    const current = { ...initial, displayName: 'Changed Name' }
    expect(hasActualChanges(current, initial)).toBe(true)
  })

  it('should return true when scopeType changes', () => {
    const initial = buildScopeInitialValues(openidScope)
    const current = { ...initial, scopeType: 'oauth' }
    expect(hasActualChanges(current, initial)).toBe(true)
  })

  it('should return true when claims array changes', () => {
    const initial = buildScopeInitialValues(openidScope)
    const current = { ...initial, claims: [...(initial.claims ?? []), 'new-claim'] }
    expect(hasActualChanges(current, initial)).toBe(true)
  })

  it('should return true when defaultScope changes', () => {
    const initial = buildScopeInitialValues(openidScope)
    const current = { ...initial, defaultScope: false }
    expect(hasActualChanges(current, initial)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// buildScopeChangedFieldOperations
// ---------------------------------------------------------------------------

describe('buildScopeChangedFieldOperations', () => {
  it('should return empty operations when nothing has changed', () => {
    const initial = buildScopeInitialValues(openidScope)
    const current = { ...initial }
    const ops = buildScopeChangedFieldOperations(initial, current, t)
    expect(ops).toHaveLength(0)
  })

  it('should return an operation for a changed displayName', () => {
    const initial = buildScopeInitialValues(openidScope)
    const current = { ...initial, displayName: 'New Name' }
    const ops = buildScopeChangedFieldOperations(initial, current, t)
    expect(ops.some((op) => op.value === 'New Name')).toBe(true)
  })

  it('should return an operation for a changed scopeType', () => {
    const initial = buildScopeInitialValues(openidScope)
    const current = { ...initial, scopeType: 'oauth' }
    const ops = buildScopeChangedFieldOperations(initial, current, t)
    expect(ops.some((op) => op.value === 'oauth')).toBe(true)
  })

  it('should include claims operation when claims change', () => {
    const initial = buildScopeInitialValues(openidScope)
    const current = { ...initial, claims: [] }
    const ops = buildScopeChangedFieldOperations(initial, current, t)
    expect(ops.length).toBeGreaterThan(0)
  })

  it('should handle UMA scope changes', () => {
    const initial = buildScopeInitialValues(umaScope)
    const current = { ...initial, iconUrl: 'https://example.com/new-icon.png' }
    const ops = buildScopeChangedFieldOperations(initial, current, t)
    expect(ops.some((op) => op.value === 'https://example.com/new-icon.png')).toBe(true)
  })
})
