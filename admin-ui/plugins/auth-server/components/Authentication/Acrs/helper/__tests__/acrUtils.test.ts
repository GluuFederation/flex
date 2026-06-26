import {
  displayOrDash,
  getPropertiesConfig,
  isDefaultAuthNMethod,
  transformConfigurationProperties,
  buildAgamaFlowsArray,
  buildDropdownOptions,
} from 'Plugins/auth-server/components/Authentication/Acrs/helper/acrUtils'
import { SIMPLE_PASSWORD_AUTH } from '@/constants'
import { EMPTY_PLACEHOLDER } from 'Plugins/auth-server/components/Authentication/Acrs/constants'
import type {
  AuthNItem,
  ConfigurationProperty,
} from 'Plugins/auth-server/components/Authentication/types/authenticationTypes'
import type { Deployment } from 'JansConfigApi'

describe('displayOrDash', () => {
  it('returns placeholder for null, undefined and empty string', () => {
    expect(displayOrDash(null)).toBe(EMPTY_PLACEHOLDER)
    expect(displayOrDash(undefined)).toBe(EMPTY_PLACEHOLDER)
    expect(displayOrDash('')).toBe(EMPTY_PLACEHOLDER)
  })

  it('returns the value for non-empty inputs', () => {
    expect(displayOrDash('hello')).toBe('hello')
    expect(displayOrDash(0)).toBe(0)
    expect(displayOrDash(false)).toBe(false)
  })
})

describe('getPropertiesConfig', () => {
  it('returns an empty array when configurationProperties is missing', () => {
    expect(getPropertiesConfig({})).toEqual([])
  })

  it('maps key/value preferring key/value over value1/value2', () => {
    const entry: AuthNItem = {
      configurationProperties: [
        { key: 'k1', value: 'v1' },
        { value1: 'k2', value2: 'v2' },
      ],
    }
    const result = getPropertiesConfig(entry)
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ key: 'k1', value: 'v1' })
    expect(result[1]).toMatchObject({ key: 'k2', value: 'v2' })
    expect(typeof result[0].id).toBe('string')
  })

  it('falls back to empty strings when no key/value present', () => {
    const result = getPropertiesConfig({ configurationProperties: [{}] })
    expect(result[0]).toMatchObject({ key: '', value: '' })
  })
})

describe('isDefaultAuthNMethod', () => {
  it('returns true for boolean true and string "true"', () => {
    expect(isDefaultAuthNMethod(true)).toBe(true)
    expect(isDefaultAuthNMethod('true')).toBe(true)
  })

  it('returns false for other values', () => {
    expect(isDefaultAuthNMethod(false)).toBe(false)
    expect(isDefaultAuthNMethod('false')).toBe(false)
    expect(isDefaultAuthNMethod('TRUE')).toBe(false)
  })
})

describe('transformConfigurationProperties', () => {
  it('returns empty array for undefined or empty input', () => {
    expect(transformConfigurationProperties(undefined)).toEqual([])
    expect(transformConfigurationProperties([])).toEqual([])
  })

  it('filters out nullish and empty objects then maps', () => {
    const props: ConfigurationProperty[] = [
      { key: 'a', value: 'b' },
      {},
      { value1: 'c', value2: 'd' },
    ]
    const result = transformConfigurationProperties(props)
    expect(result).toEqual([
      { value1: 'a', value2: 'b', hide: false },
      { value1: 'c', value2: 'd', hide: false },
    ])
  })
})

describe('buildAgamaFlowsArray', () => {
  it('returns empty array for non-array input', () => {
    expect(buildAgamaFlowsArray([])).toEqual([])
  })

  it('builds qualified flow names skipping noDirectLaunch keys', () => {
    const list: Deployment[] = [
      {
        details: {
          projectMetadata: {
            configs: { flowA: {}, flowB: {} },
            noDirectLaunch: ['flowB'],
          },
        },
      },
    ]
    expect(buildAgamaFlowsArray(list)).toEqual(['agama_flowA'])
  })

  it('ignores deployments without configs', () => {
    const list: Deployment[] = [{ details: {} }]
    expect(buildAgamaFlowsArray(list)).toEqual([])
  })
})

describe('buildDropdownOptions', () => {
  it('places the builtin first then sorted scripts and agama flows', () => {
    const result = buildDropdownOptions(
      [
        { key: 'zeta', value: 'zeta' },
        { key: 'alpha', value: 'alpha' },
      ],
      ['agama_two', 'agama_one'],
    )
    expect(result[0]).toEqual({
      label: `${SIMPLE_PASSWORD_AUTH} (builtin)`,
      value: SIMPLE_PASSWORD_AUTH,
    })
    expect(result[1]).toEqual({ label: 'alpha (script)', value: 'alpha' })
    expect(result[2]).toEqual({ label: 'zeta (script)', value: 'zeta' })
    expect(result[3]).toEqual({ label: 'agama_one (agama)', value: 'agama_one' })
    expect(result[4]).toEqual({ label: 'agama_two (agama)', value: 'agama_two' })
  })

  it('returns just the builtin when no scripts or flows', () => {
    expect(buildDropdownOptions([], [])).toHaveLength(1)
  })
})
