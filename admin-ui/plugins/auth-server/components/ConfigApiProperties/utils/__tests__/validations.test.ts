import { configApiPropertiesSchema } from 'Plugins/auth-server/components/ConfigApiProperties/utils/validations'

describe('configApiPropertiesSchema', () => {
  it('accepts an empty object (all fields nullable/optional)', async () => {
    await expect(configApiPropertiesSchema.isValid({})).resolves.toBe(true)
  })

  it('accepts a populated valid config', async () => {
    await expect(
      configApiPropertiesSchema.isValid({
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
    await expect(
      configApiPropertiesSchema.validate({ apiProtectionType: 'Basic' }),
    ).rejects.toThrow('Invalid API protection type. Supported type is OAuth2')
  })

  it('rejects an empty approved issuer list', async () => {
    await expect(configApiPropertiesSchema.validate({ apiApprovedIssuer: [] })).rejects.toThrow(
      'At least one approved issuer is required',
    )
  })

  it('rejects a malformed issuer url', async () => {
    await expect(
      configApiPropertiesSchema.validate({ authIssuerUrl: 'not-a-url' }),
    ).rejects.toThrow('Invalid URL format')
  })

  it('rejects an unknown logging level', async () => {
    await expect(configApiPropertiesSchema.validate({ loggingLevel: 'VERBOSE' })).rejects.toThrow(
      'Invalid logging level',
    )
  })

  it('rejects a negative maxCount', async () => {
    await expect(configApiPropertiesSchema.validate({ maxCount: -1 })).rejects.toThrow(
      'Must be non-negative',
    )
  })

  it('rejects a maxCount over the ceiling', async () => {
    await expect(configApiPropertiesSchema.validate({ maxCount: 10001 })).rejects.toThrow(
      'Must not exceed 10000',
    )
  })

  it('coerces an empty-string maxCount to null (treated as absent)', async () => {
    // The number field carries a transform that maps '' -> null; feed the raw
    // form string through a loosely-typed input to exercise it.
    const input: Record<string, string> = { maxCount: '' }
    await expect(configApiPropertiesSchema.isValid(input)).resolves.toBe(true)
  })

  it('rejects a cors preflight max age above 24 hours', async () => {
    await expect(
      configApiPropertiesSchema.validate({
        corsConfigurationFilters: [{ corsPreflightMaxAge: 90000 }],
      }),
    ).rejects.toThrow('Must not exceed 24 hours (86400 seconds)')
  })
})
