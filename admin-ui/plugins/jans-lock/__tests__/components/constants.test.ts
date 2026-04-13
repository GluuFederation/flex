import { JANS_LOCK_FIELD_CONFIGS } from 'Plugins/jans-lock/components/constants'
import type { FieldType, JansLockConfigFormValues } from 'Plugins/jans-lock/types'

const VALID_TYPES: FieldType[] = ['text', 'number', 'select', 'toggle']

describe('JANS_LOCK_FIELD_CONFIGS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(JANS_LOCK_FIELD_CONFIGS)).toBe(true)
    expect(JANS_LOCK_FIELD_CONFIGS.length).toBeGreaterThan(0)
  })

  it('has no duplicate field names', () => {
    const names = JANS_LOCK_FIELD_CONFIGS.map((c) => c.name)
    const uniqueNames = new Set(names)
    expect(uniqueNames.size).toBe(names.length)
  })

  it.each(JANS_LOCK_FIELD_CONFIGS)('$name has valid type', (config) => {
    expect(VALID_TYPES).toContain(config.type)
  })

  it.each(JANS_LOCK_FIELD_CONFIGS)('$name has a label string', (config) => {
    expect(typeof config.label).toBe('string')
    expect(config.label.length).toBeGreaterThan(0)
  })

  it.each(JANS_LOCK_FIELD_CONFIGS)('$name has valid colSize', (config) => {
    const colSize = config.colSize ?? 12
    expect(colSize).toBeGreaterThanOrEqual(1)
    expect(colSize).toBeLessThanOrEqual(12)
  })

  it('all field names are valid JansLockConfigFormValues keys', () => {
    const validKeys: (keyof JansLockConfigFormValues)[] = [
      'baseDN',
      'tokenChannels',
      'disableJdkLogger',
      'loggingLevel',
      'loggingLayout',
      'externalLoggerConfiguration',
      'disableExternalLoggerConfiguration',
      'metricReporterEnabled',
      'metricReporterInterval',
      'metricReporterKeepDataDays',
      'cleanServiceInterval',
      'metricChannel',
      'pdpType',
      'policiesJsonUrisAuthorizationToken',
      'policiesJsonUris',
      'policiesZipUrisAuthorizationToken',
      'policiesZipUris',
    ]

    JANS_LOCK_FIELD_CONFIGS.forEach((config) => {
      expect(validKeys).toContain(config.name)
    })
  })

  it('select fields have selectOptions defined', () => {
    const selectConfigs = JANS_LOCK_FIELD_CONFIGS.filter((c) => c.type === 'select')
    selectConfigs.forEach((config) => {
      expect(config.selectOptions).toBeDefined()
      expect(Array.isArray(config.selectOptions)).toBe(true)
      expect(config.selectOptions!.length).toBeGreaterThan(0)
    })
  })

  it('toggle fields are grouped at the end', () => {
    const types = JANS_LOCK_FIELD_CONFIGS.map((c) => c.type)
    const lastNonToggleIndex = types.reduce((acc, type, i) => (type !== 'toggle' ? i : acc), -1)
    const firstToggleIndex = types.indexOf('toggle')

    // There must be toggle fields and they must come after all non-toggle fields
    expect(firstToggleIndex).not.toBe(-1)
    expect(firstToggleIndex).toBeGreaterThan(lastNonToggleIndex)
  })
})
