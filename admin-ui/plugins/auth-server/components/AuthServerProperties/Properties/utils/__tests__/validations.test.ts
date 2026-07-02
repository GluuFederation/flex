import type { TFunction } from 'i18next'
import { createAppConfigurationSchema } from 'Plugins/auth-server/components/AuthServerProperties/Properties/utils/validations'

const t = ((key: string) => key) as TFunction

describe('createAppConfigurationSchema', () => {
  it('accepts an empty object (all fields nullable/optional)', async () => {
    await expect(createAppConfigurationSchema().isValid({})).resolves.toBe(true)
  })

  it('accepts valid urls and non-negative numbers', async () => {
    await expect(
      createAppConfigurationSchema().isValid({
        issuer: 'https://issuer.example.com',
        tokenEndpoint: 'https://issuer.example.com/token',
        accessTokenLifetime: 3600,
        idTokenLifetime: 0,
      }),
    ).resolves.toBe(true)
  })

  it('rejects a malformed url with the default message', async () => {
    await expect(createAppConfigurationSchema().validate({ issuer: 'not-a-url' })).rejects.toThrow(
      'Invalid URL format',
    )
  })

  it('uses the translated url message when a t function is supplied', async () => {
    await expect(createAppConfigurationSchema(t).validate({ issuer: 'not-a-url' })).rejects.toThrow(
      'validation_messages.invalid_url_format',
    )
  })

  it('rejects a negative duration with the default message', async () => {
    await expect(
      createAppConfigurationSchema().validate({ accessTokenLifetime: -1 }),
    ).rejects.toThrow('Must be non-negative')
  })

  it('uses the translated non-negative message when a t function is supplied', async () => {
    await expect(
      createAppConfigurationSchema(t).validate({ accessTokenLifetime: -1 }),
    ).rejects.toThrow('validation_messages.must_be_non_negative')
  })

  it('coerces an empty-string number field to null (treated as absent)', async () => {
    // The number fields carry a transform mapping '' -> null; feed the raw form
    // string through a loosely-typed input to exercise it.
    const input: Record<string, string> = { accessTokenLifetime: '' }
    await expect(createAppConfigurationSchema().isValid(input)).resolves.toBe(true)
  })

  it('validates the nested ssaConfiguration object', async () => {
    await expect(
      createAppConfigurationSchema().validate({
        ssaConfiguration: { ssaEndpoint: 'not-a-url' },
      }),
    ).rejects.toThrow('Invalid URL format')

    await expect(
      createAppConfigurationSchema().isValid({
        ssaConfiguration: {
          ssaEndpoint: 'https://issuer.example.com/ssa',
          ssaExpirationInDays: 30,
        },
      }),
    ).resolves.toBe(true)
  })
})
