import {
  AppConfigurationAllResponseTypesSupportedItem,
  AppConfigurationFeatureFlagsItem,
  AppConfigurationGrantTypesSupportedByDynamicRegistrationItem,
  AppConfigurationGrantTypesSupportedItem,
  AppConfigurationResponseModesSupportedItem,
  AppConfigurationResponseTypesSupportedItemItem,
} from 'JansConfigApi'
import type { AppConfiguration } from './types'

export const FIGMA_PRIORITY_ROWS: Array<[string, string?]> = [
  ['issuer', 'baseEndpoint'],
  ['authorizationEndpoint', 'authorizationChallengeEndpoint'],
  ['tokenEndpoint', 'tokenRevocationEndpoint'],
  ['userInfoEndpoint', 'clientInfoEndpoint'],
  ['checkSessionIFrame', 'endSessionEndpoint'],
  ['jwksUri', 'archivedJwksUri'],
  ['registrationEndpoint', 'openIdDiscoveryEndpoint'],
  ['openIdConfigurationEndpoint', 'idGenerationEndpoint'],
  ['introspectionEndpoint', 'parEndpoint'],
]

export const DEFAULT_FORM_LABEL_SIZE = 6
export const SIMPLE_ROWS_PER_CHUNK = 20
export const COMPLEX_ENTRIES_PER_CHUNK = 4
export const NESTED_ITEMS_PER_CHUNK = 20
export const DEFAULT_ACR_LABEL_KEY = 'fields.default_acr'
export const DEFAULT_ACR_PATH = '/ACR'
export const ACR_CHALLENGE_KEY = 'authorizationChallengeDefaultAcr'

export const KEY_GROUP_ORDER = {
  INPUT: 0,
  BOOLEAN: 1,
  ARRAY: 2,
} as const

const PRIORITY_KEYS = FIGMA_PRIORITY_ROWS.flatMap(([l, r]) => (r ? [l, r] : [l]))

export const DEFAULT_AUTH_SERVER_CONFIG: AppConfiguration = Object.fromEntries(
  PRIORITY_KEYS.map((key) => [key, '']),
) as AppConfiguration

const PLACEHOLDER_OPTION_VALUES = new Set<string>(['none', 'unknown'])

const toOptionValues = (values: Record<string, string>): string[] =>
  Object.values(values).filter((value) => !PLACEHOLDER_OPTION_VALUES.has(value))

export const PROPERTY_OPTION_VALUES: Readonly<Record<string, readonly string[]>> = {
  grantTypesSupported: toOptionValues(AppConfigurationGrantTypesSupportedItem),
  grantTypesSupportedByDynamicRegistration: toOptionValues(
    AppConfigurationGrantTypesSupportedByDynamicRegistrationItem,
  ),
  responseModesSupported: toOptionValues(AppConfigurationResponseModesSupportedItem),
  allResponseTypesSupported: toOptionValues(AppConfigurationAllResponseTypesSupportedItem),
  responseTypesSupported: toOptionValues(AppConfigurationResponseTypesSupportedItemItem),
  featureFlags: toOptionValues(AppConfigurationFeatureFlagsItem),
}
