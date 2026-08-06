import { getConfigApiPropertiesSchema } from 'Plugins/auth-server/components/ConfigApiProperties/utils/validations'

import type { TFunction } from 'i18next'

const t = ((key: string) => key) as TFunction
const schema = getConfigApiPropertiesSchema(t)

describe('configApiPropertiesSchema', () => {
  it('accepts an empty object (all fields nullable/optional)', async () => {
    await expect(schema.isValid({})).resolves.toBe(true)
  })

  it('accepts a populated valid config', async () => {
    await expect(
      schema.isValid({
        serviceName: 'jans-config-api',
        configOauthEnabled: true,
        apiProtectionType: 'OAuth2',
        apiApprovedIssuer: ['https://issuer.example.com'],
        authIssuerUrl: 'https://issuer.example.com',
        loggingLevel: 'INFO',
        loggingLayout: 'text',
        maxCount: 100,
      }),
    ).resolves.toBe(true)
  })

  it('rejects an unsupported api protection type', async () => {
    await expect(schema.validate({ apiProtectionType: 'Basic' })).rejects.toThrow(
      'validation_messages.api_protection_type_invalid',
    )
  })

  it('rejects an empty approved issuer list', async () => {
    await expect(schema.validate({ apiApprovedIssuer: [] })).rejects.toThrow(
      'validation_messages.min_one_approved_issuer',
    )
  })

  it('rejects a malformed issuer url', async () => {
    await expect(schema.validate({ authIssuerUrl: 'not-a-url' })).rejects.toThrow(
      'validation_messages.invalid_url_format',
    )
  })

  it('rejects an unknown logging level', async () => {
    await expect(schema.validate({ loggingLevel: 'VERBOSE' })).rejects.toThrow(
      'messages.logging_level_invalid',
    )
  })

  it('rejects a negative maxCount', async () => {
    await expect(schema.validate({ maxCount: -1 })).rejects.toThrow(
      'validation_messages.must_be_non_negative',
    )
  })

  it('rejects a maxCount over the ceiling', async () => {
    await expect(schema.validate({ maxCount: 10001 })).rejects.toThrow(
      'validation_messages.must_not_exceed',
    )
  })

  it('coerces an empty-string maxCount to null (treated as absent)', async () => {
    // The number field carries a transform that maps '' -> null; feed the raw
    // form string through a loosely-typed input to exercise it.
    const input: Record<string, string> = { maxCount: '' }
    await expect(schema.isValid(input)).resolves.toBe(true)
  })

  it('rejects a cors preflight max age above 24 hours', async () => {
    await expect(
      schema.validate({
        corsConfigurationFilters: [{ corsPreflightMaxAge: 90000 }],
      }),
    ).rejects.toThrow('validation_messages.cors_preflight_max_age_max')
  })
})
