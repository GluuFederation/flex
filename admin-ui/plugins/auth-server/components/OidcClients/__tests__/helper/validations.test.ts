import { getClientValidationSchema } from 'Plugins/auth-server/components/OidcClients/helper/validations'
import type { TFunction } from 'i18next'

// Simple mock translation function — returns the key so error messages are predictable
const t = ((key: string) => key) as TFunction

const schema = getClientValidationSchema(t)

// Helper to cast partial values to whatever Yup expects
const validate = (
  values: Record<
    string,
    string | string[] | number | boolean | null | undefined | Record<string, string | null>
  >,
) => schema.validate(values, { abortEarly: false })

// ---------------------------------------------------------------------------
// clientName
// ---------------------------------------------------------------------------

describe('clientName validation', () => {
  it('rejects empty clientName', async () => {
    await expect(
      validate({ clientName: '', redirectUris: ['https://example.com'] }),
    ).rejects.toThrow()
  })

  it('rejects clientName shorter than 5 characters', async () => {
    await expect(
      validate({ clientName: 'ab', redirectUris: ['https://example.com'] }),
    ).rejects.toThrow()
  })

  it('rejects clientName longer than 200 characters', async () => {
    await expect(
      validate({ clientName: 'a'.repeat(201), redirectUris: ['https://example.com'] }),
    ).rejects.toThrow()
  })

  it('accepts a valid clientName', async () => {
    await expect(
      validate({ clientName: 'My Test Client', redirectUris: ['https://example.com'] }),
    ).resolves.toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// clientSecret
// ---------------------------------------------------------------------------

describe('clientSecret validation', () => {
  it('accepts undefined/absent clientSecret', async () => {
    await expect(
      validate({ clientName: 'Valid Client', redirectUris: ['https://example.com'] }),
    ).resolves.toBeDefined()
  })

  it('accepts null clientSecret', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        clientSecret: null,
        redirectUris: ['https://example.com'],
      }),
    ).resolves.toBeDefined()
  })

  it('rejects clientSecret shorter than 8 characters', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        clientSecret: 'short',
        redirectUris: ['https://example.com'],
      }),
    ).rejects.toThrow()
  })

  it('accepts clientSecret of exactly 8 characters', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        clientSecret: 'exactly8',
        redirectUris: ['https://example.com'],
      }),
    ).resolves.toBeDefined()
  })

  it('rejects clientSecret longer than 256 characters', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        clientSecret: 'a'.repeat(257),
        redirectUris: ['https://example.com'],
      }),
    ).rejects.toThrow()
  })
})

// ---------------------------------------------------------------------------
// redirectUris
// ---------------------------------------------------------------------------

describe('redirectUris validation', () => {
  it('rejects empty redirectUris array', async () => {
    await expect(validate({ clientName: 'Valid Client', redirectUris: [] })).rejects.toThrow()
  })

  it('rejects invalid URI in redirectUris', async () => {
    await expect(
      validate({ clientName: 'Valid Client', redirectUris: ['not-a-uri'] }),
    ).rejects.toThrow()
  })

  it('accepts a valid https URI', async () => {
    await expect(
      validate({ clientName: 'Valid Client', redirectUris: ['https://example.com/callback'] }),
    ).resolves.toBeDefined()
  })

  it('rejects a custom scheme URI (validator only allows http/https)', async () => {
    await expect(
      validate({ clientName: 'Valid Client', redirectUris: ['myapp://callback'] }),
    ).rejects.toThrow()
  })

  it('rejects an empty string entry in redirectUris', async () => {
    await expect(
      validate({ clientName: 'Valid Client', redirectUris: ['https://example.com', ''] }),
    ).rejects.toThrow()
  })
})

// ---------------------------------------------------------------------------
// accessTokenLifetime
// ---------------------------------------------------------------------------

describe('accessTokenLifetime validation', () => {
  it('accepts undefined accessTokenLifetime (optional)', async () => {
    await expect(
      validate({ clientName: 'Valid Client', redirectUris: ['https://example.com'] }),
    ).resolves.toBeDefined()
  })

  it('rejects zero accessTokenLifetime', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        redirectUris: ['https://example.com'],
        accessTokenLifetime: 0,
      }),
    ).rejects.toThrow()
  })

  it('rejects negative accessTokenLifetime', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        redirectUris: ['https://example.com'],
        accessTokenLifetime: -1,
      }),
    ).rejects.toThrow()
  })

  it('rejects float accessTokenLifetime', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        redirectUris: ['https://example.com'],
        accessTokenLifetime: 1.5,
      }),
    ).rejects.toThrow()
  })

  it('accepts a positive integer accessTokenLifetime', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        redirectUris: ['https://example.com'],
        accessTokenLifetime: 3600,
      }),
    ).resolves.toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// Optional URI fields (frontChannelLogoutUri, clientUri, etc.)
// ---------------------------------------------------------------------------

describe('optional URI fields', () => {
  it('accepts null frontChannelLogoutUri', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        redirectUris: ['https://example.com'],
        frontChannelLogoutUri: null,
      }),
    ).resolves.toBeDefined()
  })

  it('rejects invalid frontChannelLogoutUri', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        redirectUris: ['https://example.com'],
        frontChannelLogoutUri: 'not-a-uri',
      }),
    ).rejects.toThrow()
  })

  it('accepts a valid clientUri', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        redirectUris: ['https://example.com'],
        clientUri: 'https://myapp.example.com',
      }),
    ).resolves.toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// attributes.redirectUrisRegex
// ---------------------------------------------------------------------------

describe('attributes.redirectUrisRegex validation', () => {
  it('accepts a valid regex pattern', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        redirectUris: ['https://example.com'],
        attributes: { redirectUrisRegex: '^https://.*' },
      }),
    ).resolves.toBeDefined()
  })

  it('rejects an invalid regex pattern', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        redirectUris: ['https://example.com'],
        attributes: { redirectUrisRegex: '[invalid(' },
      }),
    ).rejects.toThrow()
  })

  it('accepts null redirectUrisRegex', async () => {
    await expect(
      validate({
        clientName: 'Valid Client',
        redirectUris: ['https://example.com'],
        attributes: { redirectUrisRegex: null },
      }),
    ).resolves.toBeDefined()
  })
})
