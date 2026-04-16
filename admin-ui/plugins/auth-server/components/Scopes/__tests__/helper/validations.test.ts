import { getScopeValidationSchema } from 'Plugins/auth-server/components/Scopes/helper/validations'

// Helper to validate and collect errors
const validate = (values: Record<string, unknown>, options: { isExistingScope?: boolean } = {}) => {
  const schema = getScopeValidationSchema(options)
  return schema.validate(values, { abortEarly: false })
}

// ---------------------------------------------------------------------------
// id field
// ---------------------------------------------------------------------------

describe('id validation', () => {
  it('rejects empty id', async () => {
    await expect(
      validate({ id: '', displayName: 'Valid Display', scopeType: 'oauth' }),
    ).rejects.toThrow()
  })

  it('rejects id shorter than 5 characters', async () => {
    await expect(
      validate({ id: 'abc', displayName: 'Valid Display', scopeType: 'oauth' }),
    ).rejects.toThrow()
  })

  it('accepts a valid id', async () => {
    await expect(
      validate({ id: 'openid', displayName: 'Valid Display', scopeType: 'oauth' }),
    ).resolves.toBeDefined()
  })

  it('accepts a URL id', async () => {
    await expect(
      validate({
        id: 'https://jans.io/oauth/config/scopes.readonly',
        displayName: 'Valid Display',
        scopeType: 'oauth',
      }),
    ).resolves.toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// displayName field
// ---------------------------------------------------------------------------

describe('displayName validation', () => {
  it('rejects empty displayName', async () => {
    await expect(validate({ id: 'openid', displayName: '', scopeType: 'oauth' })).rejects.toThrow()
  })

  it('rejects displayName shorter than 5 characters', async () => {
    await expect(
      validate({ id: 'openid', displayName: 'ab', scopeType: 'oauth' }),
    ).rejects.toThrow()
  })

  it('accepts a valid displayName', async () => {
    await expect(
      validate({ id: 'openid', displayName: 'OpenID Connect', scopeType: 'oauth' }),
    ).resolves.toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// scopeType field
// ---------------------------------------------------------------------------

describe('scopeType validation', () => {
  it('rejects missing scopeType', async () => {
    await expect(validate({ id: 'openid', displayName: 'OpenID Connect' })).rejects.toThrow()
  })

  it('accepts openid scopeType', async () => {
    await expect(
      validate({
        id: 'openid',
        displayName: 'OpenID Connect',
        scopeType: 'openid',
        claims: ['claim1'],
      }),
    ).resolves.toBeDefined()
  })

  it('accepts oauth scopeType', async () => {
    await expect(
      validate({ id: 'some_oauth_scope', displayName: 'OAuth Scope', scopeType: 'oauth' }),
    ).resolves.toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// claims (conditional on openid/dynamic scopeType)
// ---------------------------------------------------------------------------

describe('claims validation', () => {
  it('requires at least one claim for openid scope', async () => {
    await expect(
      validate({ id: 'openid', displayName: 'OpenID Connect', scopeType: 'openid', claims: [] }),
    ).rejects.toThrow()
  })

  it('accepts non-empty claims for openid scope', async () => {
    await expect(
      validate({
        id: 'openid',
        displayName: 'OpenID Connect',
        scopeType: 'openid',
        claims: ['inum=2B29,ou=attributes,o=jans'],
      }),
    ).resolves.toBeDefined()
  })

  it('does not require claims for oauth scope', async () => {
    await expect(
      validate({ id: 'some_scope', displayName: 'Some Scope', scopeType: 'oauth', claims: [] }),
    ).resolves.toBeDefined()
  })

  it('requires at least one claim for dynamic scope', async () => {
    await expect(
      validate({
        id: 'permission',
        displayName: 'Permission Scope',
        scopeType: 'dynamic',
        claims: [],
        dynamicScopeScripts: ['inum=CB5B-3211,ou=scripts,o=jans'],
      }),
    ).rejects.toThrow()
  })
})

// ---------------------------------------------------------------------------
// dynamicScopeScripts (conditional on dynamic scopeType)
// ---------------------------------------------------------------------------

describe('dynamicScopeScripts validation', () => {
  it('requires at least one script for dynamic scope', async () => {
    await expect(
      validate({
        id: 'permission',
        displayName: 'Permission Scope',
        scopeType: 'dynamic',
        dynamicScopeScripts: [],
        claims: ['inum=2B29,ou=attributes,o=jans'],
      }),
    ).rejects.toThrow()
  })

  it('does not require scripts for non-dynamic scope', async () => {
    await expect(
      validate({
        id: 'openid',
        displayName: 'OpenID Connect',
        scopeType: 'openid',
        claims: ['inum=2B29,ou=attributes,o=jans'],
        dynamicScopeScripts: [],
      }),
    ).resolves.toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// umaAuthorizationPolicies (conditional on uma scopeType for new scope)
// ---------------------------------------------------------------------------

describe('umaAuthorizationPolicies validation', () => {
  it('requires at least one policy for new uma scope', async () => {
    await expect(
      validate({
        id: 'https://example.com/uma_scope',
        displayName: 'UMA Scope Name',
        scopeType: 'uma',
        umaAuthorizationPolicies: [],
        iconUrl: 'https://example.com/icon.png',
      }),
    ).rejects.toThrow()
  })

  it('does not require policies for existing uma scope', async () => {
    await expect(
      validate(
        {
          id: 'https://example.com/uma_scope',
          displayName: 'UMA Scope Name',
          scopeType: 'uma',
          umaAuthorizationPolicies: [],
        },
        { isExistingScope: true },
      ),
    ).resolves.toBeDefined()
  })

  it('does not require policies for non-uma scope', async () => {
    await expect(
      validate({
        id: 'openid',
        displayName: 'OpenID Connect',
        scopeType: 'openid',
        claims: ['inum=2B29,ou=attributes,o=jans'],
        umaAuthorizationPolicies: [],
      }),
    ).resolves.toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// iconUrl (conditional on uma scopeType for new scope)
// ---------------------------------------------------------------------------

describe('iconUrl validation for uma scope', () => {
  it('requires iconUrl for new uma scope', async () => {
    await expect(
      validate({
        id: 'https://example.com/uma_scope',
        displayName: 'UMA Scope Name',
        scopeType: 'uma',
        umaAuthorizationPolicies: ['inum=2DAF-F9A5,ou=scripts,o=jans'],
        iconUrl: '',
      }),
    ).rejects.toThrow()
  })

  it('rejects invalid URL for iconUrl', async () => {
    await expect(
      validate({
        id: 'https://example.com/uma_scope',
        displayName: 'UMA Scope Name',
        scopeType: 'uma',
        umaAuthorizationPolicies: ['inum=2DAF-F9A5,ou=scripts,o=jans'],
        iconUrl: 'not-a-url',
      }),
    ).rejects.toThrow()
  })

  it('accepts valid URL for iconUrl for new uma scope', async () => {
    await expect(
      validate({
        id: 'https://example.com/uma_scope',
        displayName: 'UMA Scope Name',
        scopeType: 'uma',
        umaAuthorizationPolicies: ['inum=2DAF-F9A5,ou=scripts,o=jans'],
        iconUrl: 'https://example.com/icon.png',
      }),
    ).resolves.toBeDefined()
  })

  it('does not require iconUrl for existing uma scope', async () => {
    await expect(
      validate(
        {
          id: 'https://example.com/uma_scope',
          displayName: 'UMA Scope Name',
          scopeType: 'uma',
          iconUrl: '',
        },
        { isExistingScope: true },
      ),
    ).resolves.toBeDefined()
  })

  it('does not require iconUrl for non-uma scope', async () => {
    await expect(
      validate({
        id: 'openid',
        displayName: 'OpenID Connect',
        scopeType: 'openid',
        claims: ['inum=2B29,ou=attributes,o=jans'],
        iconUrl: '',
      }),
    ).resolves.toBeDefined()
  })
})
