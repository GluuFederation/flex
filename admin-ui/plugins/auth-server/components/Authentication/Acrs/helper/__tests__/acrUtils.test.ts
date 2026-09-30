import {
  displayOrDash,
  getPropertiesConfig,
  isDefaultAuthNMethod,
  transformConfigurationProperties,
  buildAgamaFlowsArray,
  buildDropdownOptions,
  buildAgamaAcrItems,
  buildAcrTableRows,
} from 'Plugins/auth-server/components/Authentication/Acrs/helper/acrUtils'
import { SIMPLE_PASSWORD_AUTH } from '@/constants'
import { EMPTY_PLACEHOLDER } from 'Plugins/auth-server/components/Authentication/Acrs/constants'
import type {
  AuthNItem,
  ConfigurationProperty,
} from 'Plugins/auth-server/components/Authentication/types/authenticationTypes'
import type { Deployment } from 'JansConfigApi'
import {
  flowsOutcome,
  mockAgamaDeployments,
  mockLdapConfigurations,
  mockScripts,
} from 'Plugins/auth-server/components/Authentication/__tests__/fixtures/mockAuthenticationData'

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

const [casaProject, passwordProject] = mockAgamaDeployments

describe('buildAgamaFlowsArray', () => {
  it('returns an empty array for empty or non-array input', () => {
    expect(buildAgamaFlowsArray([])).toEqual([])
    expect(buildAgamaFlowsArray(undefined as never)).toEqual([])
  })

  it('lists every deployed flow, including flows that have no configs entry', () => {
    expect(buildAgamaFlowsArray([passwordProject])).toEqual([
      'agama_org.gluu.agama.pw.reset',
      'agama_org.gluu.agama.pw.main',
    ])
  })

  it('skips noDirectLaunch flows and flows that failed to deploy', () => {
    expect(buildAgamaFlowsArray([casaProject])).toEqual(['agama_io.jans.casa.authn.main'])
  })

  it('ignores configs keys that are not deployed flows', () => {
    const list: Deployment[] = [
      { details: { flowsError: flowsOutcome({}), projectMetadata: { configs: { ghost: {} } } } },
    ]
    expect(buildAgamaFlowsArray(list)).toEqual([])
  })

  it('ignores deployments that are still deploying or have no details', () => {
    const list: Deployment[] = [{ id: 'pending' }, { details: {} }]
    expect(buildAgamaFlowsArray(list)).toEqual([])
  })
})

describe('buildAgamaAcrItems', () => {
  it('returns an empty list for missing input', () => {
    expect(buildAgamaAcrItems(undefined)).toEqual([])
    expect(buildAgamaAcrItems([])).toEqual([])
  })

  it('maps each launchable flow to an agama ACR row with its parent project', () => {
    expect(buildAgamaAcrItems([casaProject, passwordProject])).toEqual([
      {
        acrName: 'agama_io.jans.casa.authn.main',
        name: 'io.jans.casa.authn.main',
        acrType: 'agama',
        agamaProject: 'casa',
      },
      {
        acrName: 'agama_org.gluu.agama.pw.reset',
        name: 'org.gluu.agama.pw.reset',
        acrType: 'agama',
        agamaProject: 'agama-pw',
      },
      {
        acrName: 'agama_org.gluu.agama.pw.main',
        name: 'org.gluu.agama.pw.main',
        acrType: 'agama',
        agamaProject: 'agama-pw',
      },
    ])
  })

  it('falls back to the deployment id when the project has no name', () => {
    const list: Deployment[] = [
      { id: 'dep-1', details: { flowsError: flowsOutcome({ flowA: null }) } },
    ]
    expect(buildAgamaAcrItems(list)[0].agamaProject).toBe('dep-1')
  })

  it('produces exactly the ACRs that buildAgamaFlowsArray offers in dropdowns', () => {
    const list = [casaProject, passwordProject]
    expect(buildAgamaAcrItems(list).map((item) => item.acrName)).toEqual(buildAgamaFlowsArray(list))
  })
})

describe('buildAcrTableRows', () => {
  const acrNames = (rows: AuthNItem[]) => rows.map((row) => row.acrName)

  it('lists only the built-in ACR when there is nothing else', () => {
    expect(acrNames(buildAcrTableRows({}))).toEqual(['simple_password_auth'])
  })

  it('puts the built-in ACR first, then LDAP and scripts by level, then Agama ACRs by name', () => {
    const rows = buildAcrTableRows({
      ldapConfigurations: mockLdapConfigurations,
      scripts: mockScripts,
      deployments: mockAgamaDeployments,
    })
    expect(acrNames(rows)).toEqual([
      'simple_password_auth',
      'test-ldap',
      'test_otp',
      'agama_io.jans.casa.authn.main',
      'agama_org.gluu.agama.pw.main',
      'agama_org.gluu.agama.pw.reset',
    ])
  })

  it('orders LDAP configs and scripts together by level', () => {
    const rows = buildAcrTableRows({
      ldapConfigurations: [{ ...mockLdapConfigurations[0], configId: 'late-ldap', level: 20 }],
      scripts: [{ ...mockScripts[0], name: 'early_script', level: 2 }],
    })
    expect(acrNames(rows)).toEqual(['simple_password_auth', 'early_script', 'late-ldap'])
  })

  it('leaves out disabled LDAP configs and disabled scripts', () => {
    const rows = buildAcrTableRows({
      ldapConfigurations: [{ ...mockLdapConfigurations[0], enabled: false }],
      scripts: [{ ...mockScripts[0], enabled: false }],
    })
    expect(acrNames(rows)).toEqual(['simple_password_auth'])
  })

  it('tags every row with its ACR type', () => {
    const rows = buildAcrTableRows({
      ldapConfigurations: mockLdapConfigurations,
      scripts: mockScripts,
      deployments: [passwordProject],
    })
    expect(rows.map((row) => [row.acrName, row.acrType])).toEqual([
      ['simple_password_auth', 'builtin'],
      ['test-ldap', 'ldap'],
      ['test_otp', 'script'],
      ['agama_org.gluu.agama.pw.main', 'agama'],
      ['agama_org.gluu.agama.pw.reset', 'agama'],
    ])
  })

  it('keeps the script fields the edit page needs', () => {
    const [, scriptRow] = buildAcrTableRows({ scripts: mockScripts })
    expect(scriptRow).toEqual(
      expect.objectContaining({
        inum: 'test-script-1',
        acrName: 'test_otp',
        name: 'person_authentication',
        isCustomScript: true,
      }),
    )
  })
})
