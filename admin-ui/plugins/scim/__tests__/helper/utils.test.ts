import {
  toBooleanValue,
  transformToFormValues,
  createJsonPatchFromDifferences,
  buildScimChangedFieldOperations,
} from 'Plugins/scim/helper/utils'
import type { ScimFormValues } from 'Plugins/scim/types'
import type { AppConfiguration3 } from 'JansConfigApi'
import i18next from 'i18next'

const t = i18next.t.bind(i18next)

describe('toBooleanValue', () => {
  it('returns true for boolean true', () => {
    expect(toBooleanValue(true)).toBe(true)
  })

  it('returns false for boolean false', () => {
    expect(toBooleanValue(false)).toBe(false)
  })

  it('returns true for string "true"', () => {
    expect(toBooleanValue('true')).toBe(true)
  })

  it('returns false for string "false"', () => {
    expect(toBooleanValue('false')).toBe(false)
  })

  it('returns true for string "TRUE" (case insensitive)', () => {
    expect(toBooleanValue('TRUE')).toBe(true)
  })

  it('returns false for null', () => {
    expect(toBooleanValue(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(toBooleanValue(undefined)).toBe(false)
  })

  it('returns true for truthy number', () => {
    expect(toBooleanValue(1)).toBe(true)
  })

  it('returns false for 0', () => {
    expect(toBooleanValue(0)).toBe(false)
  })
})

describe('transformToFormValues', () => {
  it('returns default values for undefined config', () => {
    const result = transformToFormValues(undefined)
    expect(result).toEqual({
      baseDN: '',
      applicationUrl: '',
      baseEndpoint: '',
      personCustomObjectClass: '',
      oxAuthIssuer: '',
      protectionMode: '',
      maxCount: '',
      bulkMaxOperations: '',
      bulkMaxPayloadSize: '',
      userExtensionSchemaURI: '',
      loggingLevel: '',
      loggingLayout: '',
      externalLoggerConfiguration: '',
      disableExternalLoggerConfiguration: false,
      metricReporterInterval: '',
      metricReporterKeepDataDays: '',
      metricReporterEnabled: false,
      disableJdkLogger: false,
      disableLoggerTimer: false,
      useLocalCache: false,
      skipDefinedPasswordValidation: false,
    })
  })

  it('returns default values for empty config', () => {
    const result = transformToFormValues({} as AppConfiguration3)
    expect(result.baseDN).toBe('')
    expect(result.applicationUrl).toBe('')
    expect(result.protectionMode).toBe('')
    expect(result.maxCount).toBe('')
    expect(result.disableJdkLogger).toBe(false)
    expect(result.useLocalCache).toBe(false)
  })

  it('transforms string fields correctly', () => {
    const config = {
      baseDN: 'ou=scim,o=gluu',
      applicationUrl: 'https://example.com',
      baseEndpoint: 'https://example.com/scim',
      personCustomObjectClass: 'gluuCustomPerson',
      oxAuthIssuer: 'https://example.com',
      protectionMode: 'OAUTH',
      loggingLevel: 'INFO',
      loggingLayout: 'text',
      userExtensionSchemaURI: 'urn:ietf:params:scim:schemas:extension',
      externalLoggerConfiguration: '/etc/logger.xml',
    } as AppConfiguration3

    const result = transformToFormValues(config)
    expect(result.baseDN).toBe('ou=scim,o=gluu')
    expect(result.applicationUrl).toBe('https://example.com')
    expect(result.baseEndpoint).toBe('https://example.com/scim')
    expect(result.personCustomObjectClass).toBe('gluuCustomPerson')
    expect(result.oxAuthIssuer).toBe('https://example.com')
    expect(result.protectionMode).toBe('OAUTH')
    expect(result.loggingLevel).toBe('INFO')
    expect(result.loggingLayout).toBe('text')
    expect(result.userExtensionSchemaURI).toBe('urn:ietf:params:scim:schemas:extension')
    expect(result.externalLoggerConfiguration).toBe('/etc/logger.xml')
  })

  it('transforms numeric fields correctly', () => {
    const config = {
      maxCount: 200,
      bulkMaxOperations: 30,
      bulkMaxPayloadSize: 3145728,
      metricReporterInterval: 300,
      metricReporterKeepDataDays: 15,
    } as AppConfiguration3

    const result = transformToFormValues(config)
    expect(result.maxCount).toBe(200)
    expect(result.bulkMaxOperations).toBe(30)
    expect(result.bulkMaxPayloadSize).toBe(3145728)
    expect(result.metricReporterInterval).toBe(300)
    expect(result.metricReporterKeepDataDays).toBe(15)
  })

  it('transforms boolean fields correctly', () => {
    const config = {
      disableExternalLoggerConfiguration: true,
      metricReporterEnabled: true,
      disableJdkLogger: true,
      disableLoggerTimer: false,
      useLocalCache: true,
      skipDefinedPasswordValidation: true,
    } as AppConfiguration3

    const result = transformToFormValues(config)
    expect(result.disableExternalLoggerConfiguration).toBe(true)
    expect(result.metricReporterEnabled).toBe(true)
    expect(result.disableJdkLogger).toBe(true)
    expect(result.disableLoggerTimer).toBe(false)
    expect(result.useLocalCache).toBe(true)
    expect(result.skipDefinedPasswordValidation).toBe(true)
  })

  it('converts string boolean values', () => {
    const config = {
      disableJdkLogger: 'true',
      metricReporterEnabled: 'false',
    } as unknown as AppConfiguration3

    const result = transformToFormValues(config)
    expect(result.disableJdkLogger).toBe(true)
    expect(result.metricReporterEnabled).toBe(false)
  })
})

describe('createJsonPatchFromDifferences', () => {
  const baseConfig: AppConfiguration3 = {
    baseDN: 'ou=scim,o=gluu',
    applicationUrl: 'https://example.com',
    baseEndpoint: 'https://example.com/scim',
    personCustomObjectClass: 'gluuCustomPerson',
    oxAuthIssuer: 'https://example.com',
    protectionMode: 'OAUTH',
    maxCount: 200,
    bulkMaxOperations: 30,
    bulkMaxPayloadSize: 3145728,
    userExtensionSchemaURI: '',
    loggingLevel: 'INFO',
    loggingLayout: 'text',
    externalLoggerConfiguration: '',
    disableExternalLoggerConfiguration: false,
    metricReporterInterval: 300,
    metricReporterKeepDataDays: 15,
    metricReporterEnabled: true,
    disableJdkLogger: false,
    disableLoggerTimer: false,
    useLocalCache: false,
    skipDefinedPasswordValidation: false,
  }

  const baseFormValues: ScimFormValues = {
    baseDN: 'ou=scim,o=gluu',
    applicationUrl: 'https://example.com',
    baseEndpoint: 'https://example.com/scim',
    personCustomObjectClass: 'gluuCustomPerson',
    oxAuthIssuer: 'https://example.com',
    protectionMode: 'OAUTH',
    maxCount: 200,
    bulkMaxOperations: 30,
    bulkMaxPayloadSize: 3145728,
    userExtensionSchemaURI: '',
    loggingLevel: 'INFO',
    loggingLayout: 'text',
    externalLoggerConfiguration: '',
    disableExternalLoggerConfiguration: false,
    metricReporterInterval: 300,
    metricReporterKeepDataDays: 15,
    metricReporterEnabled: true,
    disableJdkLogger: false,
    disableLoggerTimer: false,
    useLocalCache: false,
    skipDefinedPasswordValidation: false,
  }

  it('returns empty array when nothing changed', () => {
    const patches = createJsonPatchFromDifferences(baseConfig, baseFormValues)
    expect(patches).toEqual([])
  })

  it('creates replace operation for changed string field', () => {
    const modified = { ...baseFormValues, loggingLevel: 'DEBUG' }
    const patches = createJsonPatchFromDifferences(baseConfig, modified)
    expect(patches).toContainEqual({
      op: 'replace',
      path: '/loggingLevel',
      value: 'DEBUG',
    })
  })

  it('creates replace operation for changed numeric field', () => {
    const modified = { ...baseFormValues, maxCount: 500 }
    const patches = createJsonPatchFromDifferences(baseConfig, modified)
    expect(patches).toContainEqual({
      op: 'replace',
      path: '/maxCount',
      value: 500,
    })
  })

  it('creates replace operation for changed boolean field', () => {
    const modified = { ...baseFormValues, disableJdkLogger: true }
    const patches = createJsonPatchFromDifferences(baseConfig, modified)
    expect(patches).toContainEqual({
      op: 'replace',
      path: '/disableJdkLogger',
      value: true,
    })
  })

  it('creates remove operation when numeric field is cleared', () => {
    const modified = { ...baseFormValues, maxCount: '' }
    const patches = createJsonPatchFromDifferences(baseConfig, modified)
    expect(patches).toContainEqual({
      op: 'remove',
      path: '/maxCount',
    })
  })

  it('creates add operation for new string field value', () => {
    const configWithEmpty = {
      ...baseConfig,
      userExtensionSchemaURI: undefined,
    } as AppConfiguration3
    const modified = { ...baseFormValues, userExtensionSchemaURI: 'urn:ietf:params:scim:schemas' }
    const patches = createJsonPatchFromDifferences(configWithEmpty, modified)
    expect(patches).toContainEqual({
      op: 'add',
      path: '/userExtensionSchemaURI',
      value: 'urn:ietf:params:scim:schemas',
    })
  })

  it('handles multiple changes at once', () => {
    const modified = {
      ...baseFormValues,
      loggingLevel: 'DEBUG',
      maxCount: 500,
      useLocalCache: true,
    }
    const patches = createJsonPatchFromDifferences(baseConfig, modified)
    expect(patches).toHaveLength(3)
  })
})

describe('buildScimChangedFieldOperations', () => {
  const baseValues: ScimFormValues = {
    baseDN: 'ou=scim,o=gluu',
    applicationUrl: '',
    baseEndpoint: '',
    personCustomObjectClass: '',
    oxAuthIssuer: '',
    protectionMode: '',
    maxCount: '',
    bulkMaxOperations: '',
    bulkMaxPayloadSize: '',
    userExtensionSchemaURI: '',
    loggingLevel: 'INFO',
    loggingLayout: '',
    externalLoggerConfiguration: '',
    disableExternalLoggerConfiguration: false,
    metricReporterInterval: '',
    metricReporterKeepDataDays: '',
    metricReporterEnabled: false,
    disableJdkLogger: false,
    disableLoggerTimer: false,
    useLocalCache: false,
    skipDefinedPasswordValidation: false,
  }

  it('returns empty array when values are identical', () => {
    const ops = buildScimChangedFieldOperations(baseValues, baseValues, t)
    expect(ops).toEqual([])
  })

  it('detects changed string field', () => {
    const modified = { ...baseValues, loggingLevel: 'DEBUG' }
    const ops = buildScimChangedFieldOperations(baseValues, modified, t)
    expect(ops).toHaveLength(1)
    expect(ops[0].value).toBe('DEBUG')
  })

  it('detects changed boolean field', () => {
    const modified = { ...baseValues, disableJdkLogger: true }
    const ops = buildScimChangedFieldOperations(baseValues, modified, t)
    expect(ops).toHaveLength(1)
    expect(ops[0].value).toBe(true)
  })

  it('detects changed numeric field', () => {
    const modified = { ...baseValues, maxCount: 500 }
    const ops = buildScimChangedFieldOperations(baseValues, modified, t)
    expect(ops).toHaveLength(1)
    expect(ops[0].value).toBe(500)
  })

  it('detects multiple changed fields', () => {
    const modified = {
      ...baseValues,
      loggingLevel: 'DEBUG',
      maxCount: 500,
      useLocalCache: true,
    }
    const ops = buildScimChangedFieldOperations(baseValues, modified, t)
    expect(ops).toHaveLength(3)
  })

  it('skips disabled fields (baseDN)', () => {
    const modified = { ...baseValues, baseDN: 'ou=changed,o=gluu' }
    const ops = buildScimChangedFieldOperations(baseValues, modified, t)
    expect(ops).toEqual([])
  })
})
