import type { TFunction } from 'i18next'
import {
  samlConfigurationValidationSchema,
  websiteSsoIdentityProviderValidationSchema,
  websiteSsoServiceProviderValidationSchema,
} from 'Plugins/saml/helper/validations'

// The factory schemas only use t() to build message strings; echo the key so
// assertions match on identity. Interpolated fields render as "<key> is Required!".
const t = ((key: string) => key) as TFunction

describe('samlConfigurationValidationSchema', () => {
  it('accepts a disabled configuration without a selected IdP', async () => {
    await expect(
      samlConfigurationValidationSchema.isValid({ enabled: false, selectedIdp: '' }),
    ).resolves.toBe(true)
  })

  it('requires a selected IdP when SAML is enabled', async () => {
    await expect(
      samlConfigurationValidationSchema.validate({ enabled: true, selectedIdp: '' }),
    ).rejects.toThrow('Selected IdP is required when SAML is enabled.')
  })

  it('accepts an enabled configuration with a selected IdP', async () => {
    await expect(
      samlConfigurationValidationSchema.isValid({ enabled: true, selectedIdp: 'idp-1' }),
    ).resolves.toBe(true)
  })
})

describe('websiteSsoIdentityProviderValidationSchema', () => {
  const schema = websiteSsoIdentityProviderValidationSchema(t)

  // The name/displayName fields disallow whitespace, so fixtures avoid spaces.
  const validImported = {
    name: 'idp1',
    displayName: 'IdP-One',
    enabled: true,
    metaDataFileImportedFlag: true,
    idpMetaDataFN: 'idp-metadata.xml',
  }

  it('accepts a valid imported-metadata IdP', async () => {
    await expect(schema.isValid(validImported)).resolves.toBe(true)
  })

  it('requires the name', async () => {
    await expect(schema.validate({ ...validImported, name: '' })).rejects.toThrow()
  })

  it('rejects a name containing spaces', async () => {
    await expect(schema.validate({ ...validImported, name: 'bad name' })).rejects.toThrow(
      'errors.cannot_contain_spaces',
    )
  })

  it('requires manual fields when metadata is not imported', async () => {
    await expect(
      schema.validate({
        name: 'idp1',
        displayName: 'IdP One',
        enabled: true,
        metaDataFileImportedFlag: false,
      }),
    ).rejects.toThrow()
  })

  it('rejects a malformed single-logout url', async () => {
    await expect(
      schema.validate({ ...validImported, singleLogoutServiceUrl: 'not a url' }),
    ).rejects.toThrow()
  })
})

describe('websiteSsoServiceProviderValidationSchema', () => {
  const schema = websiteSsoServiceProviderValidationSchema(t)

  // name/displayName disallow whitespace, so fixtures avoid spaces.
  const validSp = {
    name: 'sp1',
    displayName: 'SP-One',
    spMetaDataSourceType: 'url',
    samlMetadata: {},
  }

  it('accepts a valid non-manual service provider', async () => {
    await expect(schema.isValid(validSp)).resolves.toBe(true)
  })

  it('requires the metadata source type', async () => {
    await expect(schema.validate({ ...validSp, spMetaDataSourceType: '' })).rejects.toThrow(
      'fields.metadata_location is Required!',
    )
  })

  it('requires manual metadata fields when the source type is manual', async () => {
    await expect(
      schema.validate({
        ...validSp,
        spMetaDataSourceType: 'manual',
        samlMetadata: {},
      }),
    ).rejects.toThrow()
  })
})
