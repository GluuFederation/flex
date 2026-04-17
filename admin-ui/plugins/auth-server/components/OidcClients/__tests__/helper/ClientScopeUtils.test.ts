import { findAndFilterScopeClients } from 'Plugins/auth-server/components/OidcClients/components/ClientScopeUtils'
import type {
  ClientRow,
  ScopeItem,
  FilterClientsByScope,
  AddOrgFn,
} from 'Plugins/auth-server/components/OidcClients/types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const clientA: ClientRow = {
  inum: '0001-AAAA',
  clientName: 'Client A',
  scopes: ['inum=F0C4,ou=scopes,o=jans'],
}

const clientB: ClientRow = {
  inum: '0002-BBBB',
  clientName: 'Client B',
  scopes: ['inum=43F1,ou=scopes,o=jans'],
}

const identity: AddOrgFn = (c) => c

const noFilter: FilterClientsByScope = () => []

// ---------------------------------------------------------------------------
// findAndFilterScopeClients
// ---------------------------------------------------------------------------

describe('findAndFilterScopeClients', () => {
  it('returns scope.clients when the found scope has a populated clients array', () => {
    const scopeWithClients: ScopeItem = {
      inum: 'F0C4',
      dn: 'inum=F0C4,ou=scopes,o=jans',
      id: 'openid',
      clients: [clientA],
    }
    const result = findAndFilterScopeClients('F0C4', [scopeWithClients], [], noFilter, identity)
    expect(result).toEqual([clientA])
  })

  it('applies addOrg transform to clients from scope.clients', () => {
    const withOrg: AddOrgFn = (c) => ({ ...c, organization: 'Acme' })
    const scopeWithClients: ScopeItem = {
      inum: 'F0C4',
      dn: 'inum=F0C4,ou=scopes,o=jans',
      id: 'openid',
      clients: [clientA],
    }
    const result = findAndFilterScopeClients('F0C4', [scopeWithClients], [], noFilter, withOrg)
    expect(result?.[0]?.organization).toBe('Acme')
  })

  it('falls back to filterClientsByScope when scope has no clients', () => {
    const scopeNoClients: ScopeItem = {
      inum: 'F0C4',
      dn: 'inum=F0C4,ou=scopes,o=jans',
      id: 'openid',
    }
    const filter: FilterClientsByScope = (_inum, _dn) => [clientA, clientB]
    const result = findAndFilterScopeClients(
      'F0C4',
      [scopeNoClients],
      [clientA, clientB],
      filter,
      identity,
    )
    expect(result).toEqual([clientA, clientB])
  })

  it('returns null when the scope is not found', () => {
    const result = findAndFilterScopeClients('UNKNOWN', [], [], noFilter, identity)
    expect(result).toBeNull()
  })

  it('returns null when scope has no clients and filterClientsByScope returns empty', () => {
    const scopeNoClients: ScopeItem = {
      inum: 'F0C4',
      dn: 'inum=F0C4,ou=scopes,o=jans',
      id: 'openid',
    }
    const result = findAndFilterScopeClients(
      'F0C4',
      [scopeNoClients],
      [clientA],
      noFilter,
      identity,
    )
    expect(result).toBeNull()
  })

  it('returns null when scope has empty clients array', () => {
    const scopeEmptyClients: ScopeItem = {
      inum: 'F0C4',
      dn: 'inum=F0C4,ou=scopes,o=jans',
      id: 'openid',
      clients: [],
    }
    const filter: FilterClientsByScope = () => [clientA]
    const result = findAndFilterScopeClients(
      'F0C4',
      [scopeEmptyClients],
      [clientA],
      filter,
      identity,
    )
    // Empty clients array → falls back to filter
    expect(result).toEqual([clientA])
  })

  it('uses scope.baseDn as fallback when scope.dn is absent', () => {
    const capturedArgs: { inum: string; dn: string }[] = []
    const scopeWithBaseDn: ScopeItem = {
      inum: 'F0C4',
      baseDn: 'inum=F0C4,ou=scopes,o=jans',
      id: 'openid',
    }
    const filter: FilterClientsByScope = (inum, dn) => {
      capturedArgs.push({ inum, dn })
      return [clientA]
    }
    findAndFilterScopeClients('F0C4', [scopeWithBaseDn], [clientA], filter, identity)
    expect(capturedArgs[0]?.dn).toBe('inum=F0C4,ou=scopes,o=jans')
  })
})
