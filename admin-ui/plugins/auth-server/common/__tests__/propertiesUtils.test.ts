import {
  toPairs,
  generateLabel,
  isSimplePropertyValue,
  formatPatchValue,
  formatPatchPath,
  getBaselineValue,
  isPatchNoOp,
  hasConfigurationChanges,
} from '../propertiesUtils'
import type { AppConfiguration } from '../../components/AuthServerProperties/types'

describe('toPairs', () => {
  it('pairs keys into two-column rows', () => {
    expect(toPairs(['a', 'b', 'c', 'd'])).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ])
  })

  it('handles odd number of keys with null padding', () => {
    expect(toPairs(['a', 'b', 'c'])).toEqual([
      ['a', 'b'],
      ['c', null],
    ])
  })

  it('returns empty array for empty input', () => {
    expect(toPairs([])).toEqual([])
  })

  it('handles single key', () => {
    expect(toPairs(['a'])).toEqual([['a', null]])
  })
})

describe('generateLabel', () => {
  it('converts camelCase to spaced title case', () => {
    expect(generateLabel('rotateDeviceSecret')).toBe('Rotate Device Secret')
    expect(generateLabel('useLocalCache')).toBe('Use Local Cache')
  })

  it('handles empty string', () => {
    expect(generateLabel('')).toBe('')
  })

  it('handles single word', () => {
    expect(generateLabel('enabled')).toBe('Enabled')
  })
})

describe('isSimplePropertyValue', () => {
  it('returns true for null/undefined', () => {
    expect(isSimplePropertyValue(null)).toBe(true)
    expect(isSimplePropertyValue(undefined)).toBe(true)
  })

  it('returns true for primitives', () => {
    expect(isSimplePropertyValue('hello')).toBe(true)
    expect(isSimplePropertyValue(42)).toBe(true)
    expect(isSimplePropertyValue(true)).toBe(true)
  })

  it('returns true for string arrays', () => {
    expect(isSimplePropertyValue(['a', 'b'])).toBe(true)
    expect(isSimplePropertyValue([])).toBe(true)
  })

  it('returns false for objects', () => {
    expect(isSimplePropertyValue({ key: 'value' })).toBe(false)
  })

  it('returns false for mixed arrays', () => {
    expect(isSimplePropertyValue([1, 'a'] as unknown as string[])).toBe(false)
  })
})

describe('formatPatchValue', () => {
  it('returns "(removed)" for remove ops', () => {
    expect(formatPatchValue({ op: 'remove', path: '/foo' })).toBe('(removed)')
  })

  it('returns null for null/undefined values', () => {
    expect(formatPatchValue({ op: 'replace', path: '/foo', value: null })).toBeNull()
    expect(formatPatchValue({ op: 'replace', path: '/foo', value: undefined })).toBeNull()
  })

  it('stringifies objects', () => {
    expect(formatPatchValue({ op: 'replace', path: '/foo', value: { a: 1 } })).toBe('{"a":1}')
  })

  it('returns primitive values as-is', () => {
    expect(formatPatchValue({ op: 'replace', path: '/foo', value: 'bar' })).toBe('bar')
    expect(formatPatchValue({ op: 'replace', path: '/foo', value: 42 })).toBe(42)
  })
})

describe('formatPatchPath', () => {
  it('generates label from single segment path', () => {
    expect(formatPatchPath('/loggingLevel')).toBe('Logging Level')
  })

  it('appends nested segments in brackets', () => {
    expect(formatPatchPath('/cors/allowedOrigins')).toBe('Cors [allowedOrigins]')
  })

  it('uses custom label resolver when provided', () => {
    const resolver = (key: string) => `Custom: ${key}`
    expect(formatPatchPath('/myField', resolver)).toBe('Custom: myField')
  })
})

describe('getBaselineValue', () => {
  const baseline: AppConfiguration = {
    loggingLevel: 'TRACE',
    nested: {
      innerKey: 'innerVal',
    },
  }

  it('returns top-level value', () => {
    expect(getBaselineValue(baseline, '/loggingLevel')).toBe('TRACE')
  })

  it('returns nested value', () => {
    expect(getBaselineValue(baseline, '/nested/innerKey')).toBe('innerVal')
  })

  it('returns undefined for missing path', () => {
    expect(getBaselineValue(baseline, '/nonExistent')).toBeUndefined()
  })
})

describe('isPatchNoOp', () => {
  const baseline: AppConfiguration = {
    loggingLevel: 'TRACE',
    enabled: true,
  }

  it('returns true when patch value matches baseline', () => {
    expect(isPatchNoOp({ op: 'replace', path: '/loggingLevel', value: 'TRACE' }, baseline)).toBe(
      true,
    )
  })

  it('returns false when patch value differs', () => {
    expect(isPatchNoOp({ op: 'replace', path: '/loggingLevel', value: 'INFO' }, baseline)).toBe(
      false,
    )
  })

  it('returns false for remove ops', () => {
    expect(isPatchNoOp({ op: 'remove', path: '/loggingLevel' }, baseline)).toBe(false)
  })

  it('returns false when baseline is null', () => {
    expect(isPatchNoOp({ op: 'replace', path: '/foo', value: 'bar' }, null)).toBe(false)
  })
})

describe('hasConfigurationChanges', () => {
  const baseline: AppConfiguration = { loggingLevel: 'TRACE' }

  it('returns false when patch count is 0', () => {
    expect(hasConfigurationChanges(0, { loggingLevel: 'INFO' }, baseline)).toBe(false)
  })

  it('returns true when values differ', () => {
    expect(hasConfigurationChanges(1, { loggingLevel: 'INFO' }, baseline)).toBe(true)
  })

  it('returns false when values are same despite patches', () => {
    expect(hasConfigurationChanges(1, { loggingLevel: 'TRACE' }, baseline)).toBe(false)
  })

  it('returns true when baseline is null and patches exist', () => {
    expect(hasConfigurationChanges(1, { loggingLevel: 'INFO' }, null)).toBe(true)
  })
})
