import {
  buildAddFormPayload,
  buildClientInitialValues,
  buildClientPayload,
  hasFormChanges,
  formatScopeDisplay,
  formatGrantTypeLabel,
  formatResponseTypeLabel,
  extractInumFromDn,
  buildScopeDn,
  filterScriptsByType,
  getScriptNameFromDn,
  formatDateForDisplay,
  formatDateTime,
  formatDateForInput,
  isValidUrl,
  hasValidUriScheme,
  truncateText,
  sortByName,
  removeDuplicates,
  arrayEquals,
  transformScopesResponse,
} from 'Plugins/auth-server/components/Clients/helper/utils'
import { EMPTY_CLIENT } from 'Plugins/auth-server/components/Clients/types'

describe('Client Utils', () => {
  describe('transformScopesResponse', () => {
    it('transforms scope entries to ClientScope format', () => {
      const entries = [
        {
          dn: 'inum=F0C4,ou=scopes,o=jans',
          inum: 'F0C4',
          id: 'openid',
          displayName: 'OpenID',
          description: 'OpenID scope',
        },
        {
          dn: 'inum=F0C5,ou=scopes,o=jans',
          inum: 'F0C5',
          id: 'profile',
          displayName: 'Profile',
          description: 'Profile scope',
        },
      ]

      const result = transformScopesResponse(entries)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        dn: 'inum=F0C4,ou=scopes,o=jans',
        inum: 'F0C4',
        id: 'openid',
        displayName: 'OpenID',
        description: 'OpenID scope',
      })
    })

    it('uses id as displayName when displayName is missing', () => {
      const entries = [{ dn: 'inum=F0C4,ou=scopes,o=jans', inum: 'F0C4', id: 'openid' }]

      const result = transformScopesResponse(entries)

      expect(result[0].displayName).toBe('openid')
    })

    it('uses empty string for dn when missing', () => {
      const entries = [{ inum: 'F0C4', id: 'openid' }]

      const result = transformScopesResponse(entries)

      expect(result[0].dn).toBe('')
    })

    it('returns empty array for null or undefined input', () => {
      expect(transformScopesResponse(null)).toEqual([])
      expect(transformScopesResponse(undefined)).toEqual([])
    })

    it('returns empty array for empty array input', () => {
      expect(transformScopesResponse([])).toEqual([])
    })
  })

  describe('buildAddFormPayload', () => {
    const mockAddFormValues = {
      clientName: 'Test Client',
      clientSecret: 'secret123',
      disabled: false,
      description: 'Test description',
      scopes: ['inum=F0C4,ou=scopes,o=jans'],
      grantTypes: ['authorization_code', 'refresh_token'],
      redirectUris: ['https://example.com/callback', ''],
      postLogoutRedirectUris: ['https://example.com/logout'],
    }

    it('transforms add form values to ClientFormValues with defaults', () => {
      const result = buildAddFormPayload(mockAddFormValues)

      expect(result.clientName).toBe('Test Client')
      expect(result.clientSecret).toBe('secret123')
      expect(result.disabled).toBe(false)
      expect(result.description).toBe('Test description')
    })

    it('sets default application type and subject type', () => {
      const result = buildAddFormPayload(mockAddFormValues)

      expect(result.applicationType).toBe('web')
      expect(result.subjectType).toBe('public')
      expect(result.tokenEndpointAuthMethod).toBe('client_secret_basic')
    })

    it('filters out empty redirect URIs', () => {
      const result = buildAddFormPayload(mockAddFormValues)

      expect(result.redirectUris).toEqual(['https://example.com/callback'])
      expect(result.postLogoutRedirectUris).toEqual(['https://example.com/logout'])
    })

    it('sets default boolean values', () => {
      const result = buildAddFormPayload(mockAddFormValues)

      expect(result.trustedClient).toBe(false)
      expect(result.persistClientAuthorizations).toBe(false)
      expect(result.includeClaimsInIdToken).toBe(false)
      expect(result.rptAsJwt).toBe(false)
      expect(result.accessTokenAsJwt).toBe(false)
      expect(result.deletable).toBe(true)
      expect(result.expirable).toBe(false)
    })

    it('sets default attributes', () => {
      const result = buildAddFormPayload(mockAddFormValues)

      expect(result.attributes).toBeDefined()
      expect(result.attributes?.requirePar).toBe(false)
      expect(result.attributes?.requirePkce).toBe(false)
      expect(result.attributes?.dpopBoundAccessToken).toBe(false)
      expect(result.attributes?.backchannelLogoutUri).toEqual([])
    })

    it('sets default empty arrays', () => {
      const result = buildAddFormPayload(mockAddFormValues)

      expect(result.contacts).toEqual([])
      expect(result.defaultAcrValues).toEqual([])
      expect(result.claims).toEqual([])
      expect(result.responseTypes).toEqual([])
      expect(result.customObjectClasses).toEqual(['top'])
    })
  })

  describe('buildClientInitialValues', () => {
    it('merges client data with empty client defaults', () => {
      const result = buildClientInitialValues({ clientName: 'Test Client' })

      expect(result.clientName).toBe('Test Client')
      expect(result.expirable).toBe(false)
    })

    it('sets expirable to true when expirationDate exists', () => {
      const result = buildClientInitialValues({
        clientName: 'Test',
        expirationDate: '2025-12-31',
      })

      expect(result.expirable).toBe(true)
    })

    it('merges nested attributes', () => {
      const result = buildClientInitialValues({
        attributes: {
          allowSpontaneousScopes: true,
        },
      })

      expect(result.attributes?.allowSpontaneousScopes).toBe(true)
    })
  })

  describe('buildClientPayload', () => {
    it('removes expirable field from payload', () => {
      const formValues = {
        ...EMPTY_CLIENT,
        clientName: 'Test',
        expirable: true,
      }
      const result = buildClientPayload(formValues as any)

      expect((result as any).expirable).toBeUndefined()
    })

    it('converts string accessTokenAsJwt to boolean', () => {
      const formValues = {
        ...EMPTY_CLIENT,
        accessTokenAsJwt: 'true' as any,
      }
      const result = buildClientPayload(formValues as any)

      expect(result.accessTokenAsJwt).toBe(true)
    })

    it('removes dn and baseDn from payload', () => {
      const formValues = {
        ...EMPTY_CLIENT,
        dn: 'some-dn',
        baseDn: 'some-baseDn',
      } as any
      const result = buildClientPayload(formValues)

      expect((result as any).dn).toBeUndefined()
      expect((result as any).baseDn).toBeUndefined()
    })
  })

  describe('hasFormChanges', () => {
    it('returns false when values are equal', () => {
      const values = { clientName: 'Test' } as any
      expect(hasFormChanges(values, values)).toBe(false)
    })

    it('returns true when values differ', () => {
      const current = { clientName: 'Test1' } as any
      const initial = { clientName: 'Test2' } as any
      expect(hasFormChanges(current, initial)).toBe(true)
    })
  })

  describe('formatScopeDisplay', () => {
    it('extracts inum from scope DN', () => {
      const dn = 'inum=F0C4,ou=scopes,o=jans'
      expect(formatScopeDisplay(dn)).toBe('F0C4')
    })

    it('returns original string if no inum found', () => {
      const dn = 'ou=scopes,o=jans'
      expect(formatScopeDisplay(dn)).toBe(dn)
    })
  })

  describe('formatGrantTypeLabel', () => {
    it('returns human-readable label for known grant types', () => {
      expect(formatGrantTypeLabel('authorization_code')).toBe('Authorization Code')
      expect(formatGrantTypeLabel('client_credentials')).toBe('Client Credentials')
      expect(formatGrantTypeLabel('refresh_token')).toBe('Refresh Token')
    })

    it('returns original value for unknown grant types', () => {
      expect(formatGrantTypeLabel('custom_grant')).toBe('custom_grant')
    })
  })

  describe('formatResponseTypeLabel', () => {
    it('returns human-readable label for known response types', () => {
      expect(formatResponseTypeLabel('code')).toBe('Code')
      expect(formatResponseTypeLabel('token')).toBe('Token')
      expect(formatResponseTypeLabel('id_token')).toBe('ID Token')
    })

    it('returns original value for unknown response types', () => {
      expect(formatResponseTypeLabel('custom_type')).toBe('custom_type')
    })
  })

  describe('extractInumFromDn', () => {
    it('extracts inum from DN string', () => {
      const dn = 'inum=abc123,ou=clients,o=jans'
      expect(extractInumFromDn(dn)).toBe('abc123')
    })

    it('returns original string if no inum pattern', () => {
      expect(extractInumFromDn('no-inum-here')).toBe('no-inum-here')
    })
  })

  describe('buildScopeDn', () => {
    it('builds scope DN from inum', () => {
      expect(buildScopeDn('F0C4')).toBe('inum=F0C4,ou=scopes,o=jans')
    })
  })

  describe('filterScriptsByType', () => {
    it('filters scripts by type and enabled status', () => {
      const scripts = [
        { scriptType: 'person_authentication', enabled: true, dn: 'dn1', name: 'Script1' },
        { scriptType: 'person_authentication', enabled: false, dn: 'dn2', name: 'Script2' },
        { scriptType: 'introspection', enabled: true, dn: 'dn3', name: 'Script3' },
      ]

      const result = filterScriptsByType(scripts, 'person_authentication')

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Script1')
    })
  })

  describe('getScriptNameFromDn', () => {
    it('returns script name when found', () => {
      const scripts = [
        { dn: 'dn1', name: 'Script1' },
        { dn: 'dn2', name: 'Script2' },
      ]

      expect(getScriptNameFromDn('dn1', scripts)).toBe('Script1')
    })

    it('returns extracted inum when script not found', () => {
      expect(getScriptNameFromDn('inum=abc123,ou=scripts,o=jans', [])).toBe('abc123')
    })
  })

  describe('formatDateForDisplay', () => {
    it('formats valid date string', () => {
      const result = formatDateForDisplay('2025-01-15T10:30:00')
      expect(result).toContain('2025')
      expect(result).toContain('15')
    })

    it('returns empty string for undefined', () => {
      expect(formatDateForDisplay(undefined)).toBe('')
    })
  })

  describe('formatDateTime', () => {
    it('formats valid date string', () => {
      const result = formatDateTime('2025-01-15T10:30:00')
      expect(result).toContain('2025')
      expect(result).toContain('15')
    })

    it('returns default fallback for undefined', () => {
      expect(formatDateTime(undefined)).toBe('--')
    })

    it('returns custom fallback when provided', () => {
      expect(formatDateTime(undefined, '-')).toBe('-')
      expect(formatDateTime(undefined, 'N/A')).toBe('N/A')
    })

    it('returns original string for invalid date', () => {
      expect(formatDateTime('invalid-date')).toBe('invalid-date')
    })
  })

  describe('formatDateForInput', () => {
    it('formats date for input field', () => {
      const result = formatDateForInput('2025-01-15T10:30:00Z')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    })

    it('returns empty string for undefined', () => {
      expect(formatDateForInput(undefined)).toBe('')
    })
  })

  describe('isValidUrl', () => {
    it('returns true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:4100/')).toBe(true)
    })

    it('returns false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('hasValidUriScheme', () => {
    it('returns true for strings with valid URI scheme prefix', () => {
      expect(hasValidUriScheme('https://example.com')).toBe(true)
      expect(hasValidUriScheme('custom-scheme://app')).toBe(true)
      expect(hasValidUriScheme('mailto:test@example.com')).toBe(true)
    })

    it('returns false for strings without valid URI scheme', () => {
      expect(hasValidUriScheme('')).toBe(false)
      expect(hasValidUriScheme('no-scheme')).toBe(false)
      expect(hasValidUriScheme('123://invalid')).toBe(false)
    })
  })

  describe('truncateText', () => {
    it('returns original text if within limit', () => {
      expect(truncateText('short', 10)).toBe('short')
    })

    it('truncates text exceeding limit', () => {
      expect(truncateText('this is a long text', 10)).toBe('this is a ...')
    })
  })

  describe('sortByName', () => {
    it('sorts items by name alphabetically', () => {
      const items = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]
      const result = sortByName(items)

      expect(result[0].name).toBe('Alice')
      expect(result[1].name).toBe('Bob')
      expect(result[2].name).toBe('Charlie')
    })

    it('handles undefined names', () => {
      const items = [{ name: 'Bob' }, { name: undefined }, { name: 'Alice' }]
      const result = sortByName(items)

      expect(result).toHaveLength(3)
    })
  })

  describe('removeDuplicates', () => {
    it('removes duplicate values', () => {
      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
      expect(removeDuplicates(['a', 'b', 'a'])).toEqual(['a', 'b'])
    })
  })

  describe('arrayEquals', () => {
    it('returns true for equal arrays', () => {
      expect(arrayEquals([1, 2, 3], [1, 2, 3])).toBe(true)
      expect(arrayEquals([1, 2, 3], [3, 2, 1])).toBe(true)
    })

    it('returns false for different arrays', () => {
      expect(arrayEquals([1, 2], [1, 2, 3])).toBe(false)
      expect(arrayEquals([1, 2, 3], [1, 2, 4])).toBe(false)
    })
  })
})
