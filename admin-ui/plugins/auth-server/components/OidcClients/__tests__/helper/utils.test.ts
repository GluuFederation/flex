import {
  buildClientInitialValues,
  toClientJsonRecord,
  buildClientTokenFieldValuePair,
  convertTokensToCSV,
  getNextStep,
  getPrevStep,
  getClientAttributeValue,
} from 'Plugins/auth-server/components/OidcClients/helper/utils'
import type {
  ClientFormInitialData,
  ClientTokenRow,
} from 'Plugins/auth-server/components/OidcClients/types'
import dayjs from 'dayjs'

// ---------------------------------------------------------------------------
// buildClientInitialValues
// ---------------------------------------------------------------------------

describe('buildClientInitialValues', () => {
  const minimal: ClientFormInitialData = {
    redirectUris: [],
    grantTypes: [],
    responseTypes: [],
    postLogoutRedirectUris: [],
    claimRedirectUris: [],
    customObjectClasses: [],
    trustedClient: false,
    persistClientAuthorizations: false,
    includeClaimsInIdToken: false,
    frontChannelLogoutSessionRequired: false,
    rptAsJwt: false,
    accessTokenAsJwt: false,
    backchannelUserCodeParameter: false,
    disabled: false,
    attributes: {},
  }

  it('maps array fields with defaults when absent', () => {
    const result = buildClientInitialValues(minimal)
    expect(result.redirectUris).toEqual([])
    expect(result.grantTypes).toEqual([])
    expect(result.responseTypes).toEqual([])
    expect(result.postLogoutRedirectUris).toEqual([])
    expect(result.claimRedirectUris).toEqual([])
    expect(result.customObjectClasses).toEqual([])
  })

  it('maps boolean fields to false by default', () => {
    const result = buildClientInitialValues(minimal)
    expect(result.trustedClient).toBe(false)
    expect(result.persistClientAuthorizations).toBe(false)
    expect(result.includeClaimsInIdToken).toBe(false)
    expect(result.frontChannelLogoutSessionRequired).toBe(false)
    expect(result.rptAsJwt).toBe(false)
    expect(result.accessTokenAsJwt).toBe(false)
    expect(result.backchannelUserCodeParameter).toBe(false)
    expect(result.disabled).toBe(false)
  })

  it('maps string fields from input', () => {
    const input: ClientFormInitialData = {
      ...minimal,
      inum: 'test-inum',
      clientName: 'My Client',
      description: 'Client description',
      applicationType: 'web',
      subjectType: 'public',
    }
    const result = buildClientInitialValues(input)
    expect(result.inum).toBe('test-inum')
    expect(result.clientName).toBe('My Client')
    expect(result.description).toBe('Client description')
    expect(result.applicationType).toBe('web')
    expect(result.subjectType).toBe('public')
  })

  it('sets expirable to true when expirationDate is provided', () => {
    const input: ClientFormInitialData = { ...minimal, expirationDate: '2030-01-01' }
    expect(buildClientInitialValues(input).expirable).toBe(true)
  })

  it('sets expirable to false when expirationDate is absent', () => {
    const result = buildClientInitialValues(minimal)
    expect(result.expirable).toBe(false)
  })

  it('strips invalid frontChannelLogoutUri', () => {
    const input: ClientFormInitialData = { ...minimal, frontChannelLogoutUri: 'not-a-uri' }
    expect(buildClientInitialValues(input).frontChannelLogoutUri).toBeUndefined()
  })

  it('keeps valid frontChannelLogoutUri', () => {
    const input: ClientFormInitialData = {
      ...minimal,
      frontChannelLogoutUri: 'https://example.com/logout',
    }
    expect(buildClientInitialValues(input).frontChannelLogoutUri).toBe('https://example.com/logout')
  })
})

// ---------------------------------------------------------------------------
// toClientJsonRecord
// ---------------------------------------------------------------------------

describe('toClientJsonRecord', () => {
  it('returns empty object for undefined', () => {
    expect(toClientJsonRecord(undefined)).toEqual({})
  })

  it('converts a client object to a plain JSON record', () => {
    const client = { inum: 'abc', clientName: 'Test', grantTypes: ['authorization_code'] }
    const result = toClientJsonRecord(client as never)
    expect(result).toEqual({ inum: 'abc', clientName: 'Test', grantTypes: ['authorization_code'] })
  })

  it('produces a deep copy (not the same reference)', () => {
    const client = { inum: 'abc', nested: { key: 'val' } }
    const result = toClientJsonRecord(client as never)
    expect(result).not.toBe(client)
    expect((result.nested as Record<string, string>).key).toBe('val')
  })
})

// ---------------------------------------------------------------------------
// buildClientTokenFieldValuePair
// ---------------------------------------------------------------------------

describe('buildClientTokenFieldValuePair', () => {
  const inum = 'client-123'
  const emptyPattern = { dateAfter: null, dateBefore: null }

  it('builds a query with only the client inum when no dates are given', () => {
    const result = buildClientTokenFieldValuePair(inum, emptyPattern, 'expirationDate')
    expect(result).toBe('clnId=client-123')
  })

  it('appends dateAfter when provided', () => {
    const pattern = { dateAfter: dayjs('2024-01-15'), dateBefore: null }
    const result = buildClientTokenFieldValuePair(inum, pattern, 'expirationDate')
    expect(result).toContain('clnId=client-123')
    expect(result).toContain('expirationDate>2024-01-15')
  })

  it('appends dateBefore when provided', () => {
    const pattern = { dateAfter: null, dateBefore: dayjs('2024-12-31') }
    const result = buildClientTokenFieldValuePair(inum, pattern, 'creationDate')
    expect(result).toContain('clnId=client-123')
    expect(result).toContain('creationDate<2024-12-31')
  })

  it('appends both dates when both are provided', () => {
    const pattern = { dateAfter: dayjs('2024-01-01'), dateBefore: dayjs('2024-06-30') }
    const result = buildClientTokenFieldValuePair(inum, pattern, 'expirationDate')
    expect(result).toContain('expirationDate>2024-01-01')
    expect(result).toContain('expirationDate<2024-06-30')
  })
})

// ---------------------------------------------------------------------------
// convertTokensToCSV
// ---------------------------------------------------------------------------

describe('convertTokensToCSV', () => {
  it('returns empty string for empty array', () => {
    expect(convertTokensToCSV([])).toBe('')
  })

  it('returns empty string for falsy input', () => {
    expect(convertTokensToCSV(null as never)).toBe('')
  })

  const row: ClientTokenRow = {
    id: 'token-1',
    tokenCode: 'code-abc',
    scope: 'openid profile',
    deletable: true,
    grantType: 'authorization_code',
    expirationDate: '2024-12-31T00:00:00Z',
    creationDate: '2024-01-01T00:00:00Z',
    tokenType: 'access_token',
  }

  it('includes a header row', () => {
    const csv = convertTokensToCSV([row])
    const lines = csv.split('\n')
    expect(lines[0]).toContain('ID')
    expect(lines[0]).toContain('TOKENCODE')
    expect(lines[0]).toContain('SCOPE')
  })

  it('includes the token data row', () => {
    const csv = convertTokensToCSV([row])
    const lines = csv.split('\n')
    expect(lines).toHaveLength(2)
    expect(lines[1]).toContain('token-1')
    expect(lines[1]).toContain('code-abc')
  })

  it('escapes commas within values', () => {
    const rowWithComma: ClientTokenRow = { ...row, scope: 'openid,profile' }
    const csv = convertTokensToCSV([rowWithComma])
    expect(csv).toContain('"openid,profile"')
  })

  it('escapes double-quotes within values', () => {
    const rowWithQuote: ClientTokenRow = { ...row, scope: 'say "hello"' }
    const csv = convertTokensToCSV([rowWithQuote])
    expect(csv).toContain('say ""hello""')
  })
})

// ---------------------------------------------------------------------------
// getNextStep / getPrevStep
// ---------------------------------------------------------------------------

describe('getNextStep', () => {
  const steps = ['Basic', 'Tokens', 'Logout', 'Advanced'] as const

  it('returns the next step in sequence', () => {
    expect(getNextStep(steps, 'Basic')).toBe('Tokens')
    expect(getNextStep(steps, 'Tokens')).toBe('Logout')
  })

  it('returns undefined past the last step', () => {
    expect(getNextStep(steps, 'Advanced')).toBeUndefined()
  })
})

describe('getPrevStep', () => {
  const steps = ['Basic', 'Tokens', 'Logout', 'Advanced'] as const

  it('returns the previous step in sequence', () => {
    expect(getPrevStep(steps, 'Advanced')).toBe('Logout')
    expect(getPrevStep(steps, 'Logout')).toBe('Tokens')
  })

  it('returns undefined before the first step', () => {
    expect(getPrevStep(steps, 'Basic')).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// getClientAttributeValue
// ---------------------------------------------------------------------------

describe('getClientAttributeValue', () => {
  it('returns the attribute value when key exists', () => {
    const obj = { attributes: { myKey: 'hello' } }
    expect(getClientAttributeValue(obj, 'myKey')).toBe('hello')
  })

  it('returns the fallback when the key is missing', () => {
    const obj = { attributes: {} }
    expect(getClientAttributeValue(obj, 'missing', 'default')).toBe('default')
  })

  it('returns undefined when the key is missing and no fallback given', () => {
    const obj = { attributes: {} }
    expect(getClientAttributeValue(obj, 'missing')).toBeUndefined()
  })

  it('returns undefined when attributes is null', () => {
    expect(getClientAttributeValue({ attributes: null }, 'key')).toBeUndefined()
  })

  it('returns undefined when attributes is absent', () => {
    expect(getClientAttributeValue({}, 'key')).toBeUndefined()
  })

  it('returns numeric attribute values', () => {
    const obj = { attributes: { count: 42 } }
    expect(getClientAttributeValue<number>(obj, 'count')).toBe(42)
  })

  it('returns boolean attribute values', () => {
    const obj = { attributes: { enabled: true } }
    expect(getClientAttributeValue<boolean>(obj, 'enabled')).toBe(true)
  })
})
