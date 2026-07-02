import {
  transformToFormValues,
  transformToIdentityProviderFormValues,
  transformToWebsiteSsoServiceProviderFormValues,
  separateConfigFields,
  cleanOptionalFields,
  buildIdentityProviderPayload,
  buildWebsiteSsoServiceProviderPayload,
} from 'Plugins/saml/helper/utils'
import type { FormValues } from 'Plugins/saml/types'

// The SP payload builder expects a fully-shaped form-values object; fixtures use
// partial inputs (with raw strings to exercise coercion), cast to the param type.
type SpPayloadInput = Parameters<typeof buildWebsiteSsoServiceProviderPayload>[0]
const spInput = (value: Record<string, string | boolean | object>): SpPayloadInput =>
  value as object as SpPayloadInput

describe('transformToFormValues', () => {
  it('coerces the SAML configuration fields', () => {
    expect(
      transformToFormValues({ enabled: true, selectedIdp: 'idp1', applicationName: 'app' }),
    ).toEqual({
      enabled: true,
      selectedIdp: 'idp1',
      ignoreValidation: false,
      applicationName: 'app',
    })
  })

  it('defaults everything for an undefined configuration', () => {
    expect(transformToFormValues(undefined)).toEqual({
      enabled: false,
      selectedIdp: '',
      ignoreValidation: false,
      applicationName: '',
    })
  })
})

describe('transformToIdentityProviderFormValues', () => {
  it('prefers nested config values and flags imported metadata', () => {
    const result = transformToIdentityProviderFormValues({
      name: 'idp1',
      displayName: 'IdP One',
      idpMetaDataFN: 'idp.xml',
      config: { idpEntityId: 'entity-from-config' },
      idpEntityId: 'entity-from-root',
    })
    expect(result.name).toBe('idp1')
    expect(result.idpEntityId).toBe('entity-from-config')
    expect(result.metaDataFileImportedFlag).toBe(true)
  })

  it('falls back to root values and clears the import flag when no file name', () => {
    const result = transformToIdentityProviderFormValues({
      name: 'idp2',
      singleSignOnServiceUrl: 'https://sso',
    })
    expect(result.singleSignOnServiceUrl).toBe('https://sso')
    expect(result.metaDataFileImportedFlag).toBe(false)
  })
})

describe('transformToWebsiteSsoServiceProviderFormValues', () => {
  it('defaults nested saml metadata and flags imported metadata', () => {
    const result = transformToWebsiteSsoServiceProviderFormValues({
      name: 'sp1',
      spMetaDataFN: 'sp.xml',
      spMetaDataSourceType: 'file',
    })
    expect(result.name).toBe('sp1')
    expect(result.metaDataFileImportedFlag).toBe(true)
    expect(result.samlMetadata.entityId).toBe('')
  })

  it('defaults everything for a null configuration', () => {
    const result = transformToWebsiteSsoServiceProviderFormValues(null)
    expect(result.enabled).toBe(false)
    expect(result.spMetaDataSourceType).toBe('')
    expect(result.releasedAttributes).toEqual([])
  })
})

describe('separateConfigFields', () => {
  it('splits config fields from root fields and trims strings', () => {
    const { rootFields, configData } = separateConfigFields({
      name: '  sp1  ',
      idpEntityId: '  entity  ',
    } as FormValues)
    expect(rootFields.name).toBe('sp1')
    expect(configData.idpEntityId).toBe('entity')
  })
})

describe('cleanOptionalFields', () => {
  it('drops null, undefined, and empty-string fields', () => {
    expect(cleanOptionalFields({ a: 'x', b: null, c: undefined, d: '   ' })).toEqual({ a: 'x' })
  })

  it('keeps empty strings when removeEmptyStrings is false', () => {
    expect(cleanOptionalFields({ a: '' }, false)).toEqual({ a: '' })
  })

  it('drops empty arrays but keeps populated ones', () => {
    expect(cleanOptionalFields({ a: [], b: ['x'] })).toEqual({ b: ['x'] })
  })

  it('recurses into nested objects and drops empty ones', () => {
    expect(cleanOptionalFields({ nested: { a: 'x', b: '' }, empty: { c: '' } })).toEqual({
      nested: { a: 'x' },
    })
  })
})

describe('buildIdentityProviderPayload', () => {
  it('coerces types and defaults status fields, preferring config data', () => {
    const payload = buildIdentityProviderPayload(
      { name: 'idp1', enabled: 'true' },
      { idpEntityId: 'entity' },
    )
    expect(payload.name).toBe('idp1')
    expect(payload.enabled).toBe(true)
    expect(payload.idpEntityId).toBe('entity')
    expect(payload.validationStatus).toBe('In Progress')
    expect(payload.status).toBe('active')
  })

  it('includes the inum only when provided', () => {
    expect(buildIdentityProviderPayload({}, {}, 'inum-1').inum).toBe('inum-1')
    expect(buildIdentityProviderPayload({}, {}).inum).toBeUndefined()
  })
})

describe('buildWebsiteSsoServiceProviderPayload', () => {
  it('coerces types and defaults status fields', () => {
    const payload = buildWebsiteSsoServiceProviderPayload(
      spInput({
        name: 'sp1',
        enabled: 'false',
        spMetaDataSourceType: 'file',
        samlMetadata: { entityId: 'e' },
      }),
    )
    expect(payload.name).toBe('sp1')
    expect(payload.enabled).toBe(false)
    expect(payload.samlMetadata.entityId).toBe('e')
    expect(payload.status).toBe('active')
  })

  it('includes the inum only when provided', () => {
    expect(
      buildWebsiteSsoServiceProviderPayload(spInput({ samlMetadata: {} }), 'inum-9').inum,
    ).toBe('inum-9')
  })
})
