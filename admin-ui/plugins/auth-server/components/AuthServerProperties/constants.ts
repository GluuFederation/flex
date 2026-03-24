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
