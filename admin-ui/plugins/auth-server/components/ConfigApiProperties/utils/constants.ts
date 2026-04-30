import type { ApiAppConfiguration } from '../types'
import { LOG_LEVELS } from '../../Logging/utils'

export const LOGGING_LEVEL_FIELD_KEYS = new Set(['logginglevel', 'loglevel'])
export const LOGGING_LEVEL_OPTIONS = LOG_LEVELS.map((item) => ({ value: item, label: item }))

export const READ_ONLY_FIELDS: readonly string[] = [
  'apiProtectionType',
  'apiClientId',
  'apiClientPassword',
  'endpointInjectionEnabled',
  'authIssuerUrl',
  'authOpenidConfigurationUrl',
  'authOpenidIntrospectionUrl',
  'authOpenidTokenUrl',
  'authOpenidRevokeUrl',
  'exclusiveAuthScopes',
  'corsConfigurationFilters',
  'serviceName',
]

export const DEFAULT_CONFIG_API_CONFIG: ApiAppConfiguration = {
  serviceName: '',
  configOauthEnabled: false,
  disableLoggerTimer: false,
  disableAuditLogger: false,
  customAttributeValidationEnabled: false,
  acrValidationEnabled: false,
  returnClientSecretInResponse: false,
  returnEncryptedClientSecretInResponse: false,
  apiApprovedIssuer: [],
  apiProtectionType: '',
  apiClientId: '',
  apiClientPassword: '',
  endpointInjectionEnabled: false,
  authIssuerUrl: '',
  authOpenidConfigurationUrl: '',
  authOpenidIntrospectionUrl: '',
  authOpenidTokenUrl: '',
  authOpenidRevokeUrl: '',
  exclusiveAuthScopes: [],
  loggingLevel: '',
  loggingLayout: '',
  disableJdkLogger: false,
  disableExternalLoggerConfiguration: false,
  maxCount: 0,
  acrExclusionList: [],
  userExclusionAttributes: [],
  userMandatoryAttributes: [],
}
