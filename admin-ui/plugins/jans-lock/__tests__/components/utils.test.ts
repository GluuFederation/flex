import {
  toBooleanValue,
  transformToFormValues,
  createPatchOperations,
  buildLockChangedFieldOperations,
} from 'Plugins/jans-lock/helper/utils'
import type { JansLockConfigFormValues } from 'Plugins/jans-lock/types'
import i18next from 'i18next'

const t = i18next.t.bind(i18next)

interface PolicySource {
  authorizationToken?: string
  policyStoreUri?: string
}

interface LockApiConfig {
  baseDN?: string
  tokenChannels?: string[] | string
  disableJdkLogger?: boolean | string
  loggingLevel?: string
  loggingLayout?: string
  externalLoggerConfiguration?: string
  disableExternalLoggerConfiguration?: boolean | string
  metricReporterEnabled?: boolean | string
  metricReporterInterval?: number | null
  metricReporterKeepDataDays?: number | null
  cleanServiceInterval?: number | null
  metricChannel?: string
  cedarlingConfiguration?: {
    policySources?: PolicySource[]
  }
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | null
    | undefined
    | { policySources?: PolicySource[] }
}

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

  it('returns false for string "False"', () => {
    expect(toBooleanValue('False')).toBe(false)
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
  it('returns default values for empty config', () => {
    const result = transformToFormValues({})
    expect(result).toEqual({
      baseDN: '',
      tokenChannels: '',
      disableJdkLogger: false,
      loggingLevel: '',
      loggingLayout: '',
      externalLoggerConfiguration: '',
      disableExternalLoggerConfiguration: false,
      metricReporterEnabled: false,
      metricReporterInterval: '',
      metricReporterKeepDataDays: '',
      cleanServiceInterval: '',
      metricChannel: '',
      policiesJsonUrisAuthorizationToken: '',
      policiesJsonUris: '',
      policiesZipUrisAuthorizationToken: '',
      policiesZipUris: '',
    })
  })

  it('transforms flat fields correctly', () => {
    const config: LockApiConfig = {
      baseDN: 'ou=lock,o=gluu',
      tokenChannels: ['channel1', 'channel2'],
      disableJdkLogger: true,
      loggingLevel: 'INFO',
      loggingLayout: 'text',
      externalLoggerConfiguration: '/etc/logger.xml',
      disableExternalLoggerConfiguration: false,
      metricReporterEnabled: true,
      metricReporterInterval: 300,
      metricReporterKeepDataDays: 15,
      cleanServiceInterval: 60,
      metricChannel: 'jans_channel',
    }

    const result = transformToFormValues(config)
    expect(result.baseDN).toBe('ou=lock,o=gluu')
    expect(result.tokenChannels).toBe('channel1, channel2')
    expect(result.disableJdkLogger).toBe(true)
    expect(result.loggingLevel).toBe('INFO')
    expect(result.loggingLayout).toBe('text')
    expect(result.externalLoggerConfiguration).toBe('/etc/logger.xml')
    expect(result.disableExternalLoggerConfiguration).toBe(false)
    expect(result.metricReporterEnabled).toBe(true)
    expect(result.metricReporterInterval).toBe(300)
    expect(result.metricReporterKeepDataDays).toBe(15)
    expect(result.cleanServiceInterval).toBe(60)
    expect(result.metricChannel).toBe('jans_channel')
  })

  it('transforms cedarlingConfiguration policy sources', () => {
    const config: LockApiConfig = {
      cedarlingConfiguration: {
        policySources: [
          { authorizationToken: 'json-token', policyStoreUri: 'https://json.example.com' },
          { authorizationToken: 'zip-token', policyStoreUri: 'https://zip.example.com' },
        ],
      },
    }

    const result = transformToFormValues(config)
    expect(result.policiesJsonUrisAuthorizationToken).toBe('json-token')
    expect(result.policiesJsonUris).toBe('https://json.example.com')
    expect(result.policiesZipUrisAuthorizationToken).toBe('zip-token')
    expect(result.policiesZipUris).toBe('https://zip.example.com')
  })

  it('handles missing cedarlingConfiguration gracefully', () => {
    const result = transformToFormValues({ loggingLevel: 'DEBUG' })
    expect(result.policiesJsonUris).toBe('')
    expect(result.policiesZipUris).toBe('')
    expect(result.policiesJsonUrisAuthorizationToken).toBe('')
    expect(result.policiesZipUrisAuthorizationToken).toBe('')
  })

  it('handles null/undefined numeric fields', () => {
    const config: LockApiConfig = {
      metricReporterInterval: null,
      metricReporterKeepDataDays: null,
      cleanServiceInterval: 60,
    }

    const result = transformToFormValues(config)
    expect(result.metricReporterInterval).toBe('')
    expect(result.metricReporterKeepDataDays).toBe('')
    expect(result.cleanServiceInterval).toBe(60)
  })

  it('converts string boolean values', () => {
    const config: LockApiConfig = {
      disableJdkLogger: 'true',
      metricReporterEnabled: 'false',
    }

    const result = transformToFormValues(config)
    expect(result.disableJdkLogger).toBe(true)
    expect(result.metricReporterEnabled).toBe(false)
  })
})

describe('createPatchOperations', () => {
  const baseConfig: LockApiConfig = {
    baseDN: 'ou=lock,o=gluu',
    tokenChannels: '',
    disableJdkLogger: true,
    loggingLevel: 'INFO',
    loggingLayout: 'text',
    externalLoggerConfiguration: '',
    disableExternalLoggerConfiguration: false,
    metricReporterEnabled: true,
    metricReporterInterval: 300,
    metricReporterKeepDataDays: 15,
    cleanServiceInterval: 60,
    metricChannel: '',
    cedarlingConfiguration: {
      policySources: [],
    },
  }

  const baseFormValues: JansLockConfigFormValues = {
    baseDN: 'ou=lock,o=gluu',
    tokenChannels: '',
    disableJdkLogger: true,
    loggingLevel: 'INFO',
    loggingLayout: 'text',
    externalLoggerConfiguration: '',
    disableExternalLoggerConfiguration: false,
    metricReporterEnabled: true,
    metricReporterInterval: 300,
    metricReporterKeepDataDays: 15,
    cleanServiceInterval: 60,
    metricChannel: '',
    policiesJsonUrisAuthorizationToken: '',
    policiesJsonUris: '',
    policiesZipUrisAuthorizationToken: '',
    policiesZipUris: '',
  }

  it('returns empty array when nothing changed', () => {
    const patches = createPatchOperations(baseFormValues, baseConfig)
    expect(patches).toEqual([])
  })

  it('creates replace operation for changed string field', () => {
    const modified = { ...baseFormValues, loggingLevel: 'DEBUG' }
    const patches = createPatchOperations(modified, baseConfig)
    expect(patches).toContainEqual({
      op: 'replace',
      path: '/loggingLevel',
      value: 'DEBUG',
    })
  })

  it('creates replace operation for changed numeric field', () => {
    const modified = { ...baseFormValues, cleanServiceInterval: 120 }
    const patches = createPatchOperations(modified, baseConfig)
    expect(patches).toContainEqual({
      op: 'replace',
      path: '/cleanServiceInterval',
      value: 120,
    })
  })

  it('creates replace operation for changed boolean field', () => {
    const modified = { ...baseFormValues, disableJdkLogger: false }
    const patches = createPatchOperations(modified, baseConfig)
    expect(patches).toContainEqual({
      op: 'replace',
      path: '/disableJdkLogger',
      value: false,
    })
  })

  it('creates add operation for new field not in original config', () => {
    const configWithout: LockApiConfig = { ...baseConfig }
    delete configWithout.metricChannel
    const modified = { ...baseFormValues, metricChannel: 'new_channel' }
    const patches = createPatchOperations(modified, configWithout)
    expect(patches).toContainEqual({
      op: 'add',
      path: '/metricChannel',
      value: 'new_channel',
    })
  })

  it('skips empty arrays for add operations', () => {
    const configWithout: LockApiConfig = { ...baseConfig }
    delete configWithout.tokenChannels
    const patches = createPatchOperations(baseFormValues, configWithout)
    const tokenPatch = patches.find((p) => p.path === '/tokenChannels')
    expect(tokenPatch).toBeUndefined()
  })

  it('creates cedarlingConfiguration patch for policy source changes', () => {
    const modified = {
      ...baseFormValues,
      policiesJsonUris: 'https://json.example.com',
      policiesJsonUrisAuthorizationToken: 'token123',
    }
    const patches = createPatchOperations(modified, baseConfig)
    const cedarPatch = patches.find((p) => p.path === '/cedarlingConfiguration')
    expect(cedarPatch).toBeDefined()
    expect(cedarPatch?.op).toBe('replace')
    expect(cedarPatch?.value).toEqual(
      expect.objectContaining({
        policySources: [
          { authorizationToken: 'token123', policyStoreUri: 'https://json.example.com' },
        ],
      }),
    )
  })

  it('creates add operation for cedarlingConfiguration when not in original', () => {
    const configWithoutCedar: LockApiConfig = { ...baseConfig }
    delete configWithoutCedar.cedarlingConfiguration
    const modified = {
      ...baseFormValues,
      policiesJsonUris: 'https://json.example.com',
    }
    const patches = createPatchOperations(modified, configWithoutCedar)
    const cedarPatch = patches.find((p) => p.path === '/cedarlingConfiguration')
    expect(cedarPatch).toBeDefined()
    expect(cedarPatch?.op).toBe('add')
  })
})

describe('buildLockChangedFieldOperations', () => {
  const baseValues: JansLockConfigFormValues = {
    baseDN: '',
    tokenChannels: '',
    disableJdkLogger: false,
    loggingLevel: 'INFO',
    loggingLayout: 'text',
    externalLoggerConfiguration: '',
    disableExternalLoggerConfiguration: false,
    metricReporterEnabled: true,
    metricReporterInterval: 300,
    metricReporterKeepDataDays: 15,
    cleanServiceInterval: 60,
    metricChannel: '',
    policiesJsonUrisAuthorizationToken: '',
    policiesJsonUris: '',
    policiesZipUrisAuthorizationToken: '',
    policiesZipUris: '',
  }

  it('returns empty array when values are identical', () => {
    const ops = buildLockChangedFieldOperations(baseValues, baseValues, t)
    expect(ops).toEqual([])
  })

  it('detects changed string field', () => {
    const modified = { ...baseValues, loggingLevel: 'DEBUG' }
    const ops = buildLockChangedFieldOperations(baseValues, modified, t)
    expect(ops).toHaveLength(1)
    expect(ops[0].value).toBe('DEBUG')
  })

  it('detects changed boolean field', () => {
    const modified = { ...baseValues, disableJdkLogger: true }
    const ops = buildLockChangedFieldOperations(baseValues, modified, t)
    expect(ops).toHaveLength(1)
    expect(ops[0].value).toBe(true)
  })

  it('detects changed numeric field', () => {
    const modified = { ...baseValues, cleanServiceInterval: 120 }
    const ops = buildLockChangedFieldOperations(baseValues, modified, t)
    expect(ops).toHaveLength(1)
    expect(ops[0].value).toBe(120)
  })

  it('detects multiple changed fields', () => {
    const modified = {
      ...baseValues,
      loggingLevel: 'DEBUG',
      cleanServiceInterval: 120,
      metricChannel: 'test',
    }
    const ops = buildLockChangedFieldOperations(baseValues, modified, t)
    expect(ops).toHaveLength(3)
  })
})
