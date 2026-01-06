import type { JsonPatch } from 'JansConfigApi'

export interface CorsConfigurationFilter {
  filterName: string
  corsEnabled: boolean
  corsAllowedOrigins: string
  corsAllowedMethods: string
  corsSupportCredentials: boolean
  corsLoggingEnabled: boolean
  corsPreflightMaxAge: number
  corsRequestDecorate: boolean
}

export interface AgamaConfiguration {
  mandatoryAttributes: string[]
  optionalAttributes: string[]
}

export interface AuditLogIgnoreObjectMapping {
  name: string
  text?: string[]
}

export interface AuditLogConf {
  enabled: boolean
  logData: boolean
  ignoreHttpMethod: string[]
  ignoreAnnotation: string[]
  ignoreObjectMapping: AuditLogIgnoreObjectMapping[]
  headerAttributes: string[]
  auditLogFilePath: string
  auditLogFileName: string
  auditLogDateFormat: string
}

export interface DataFormatConversionConf {
  enabled: boolean
  ignoreHttpMethod: string[]
}

export interface Plugin {
  name: string
  description: string
  className: string
}

export interface AssetDirMapping {
  directory: string
  type: string[]
  description: string
  jansServiceModule: string[]
}

export interface AssetMgtConfiguration {
  assetMgtEnabled: boolean
  assetServerUploadEnabled: boolean
  fileExtensionValidationEnabled: boolean
  moduleNameValidationEnabled: boolean
  assetDirMapping: AssetDirMapping[]
}

export interface ApiAppConfiguration {
  serviceName: string
  configOauthEnabled: boolean
  disableLoggerTimer: boolean
  disableAuditLogger: boolean
  customAttributeValidationEnabled: boolean
  acrValidationEnabled: boolean
  returnClientSecretInResponse: boolean
  returnEncryptedClientSecretInResponse: boolean
  apiApprovedIssuer: string[]
  apiProtectionType: string
  apiClientId: string
  apiClientPassword: string
  endpointInjectionEnabled: boolean
  authIssuerUrl: string
  authOpenidConfigurationUrl: string
  authOpenidIntrospectionUrl: string
  authOpenidTokenUrl: string
  authOpenidRevokeUrl: string
  exclusiveAuthScopes: string[]
  corsConfigurationFilters: CorsConfigurationFilter[]
  loggingLevel: string
  loggingLayout: string
  disableJdkLogger: boolean
  disableExternalLoggerConfiguration: boolean
  maxCount: number
  acrExclusionList: string[]
  userExclusionAttributes: string[]
  userMandatoryAttributes: string[]
  agamaConfiguration: AgamaConfiguration
  auditLogConf: AuditLogConf
  dataFormatConversionConf: DataFormatConversionConf
  plugins: Plugin[]
  assetMgtConfiguration: AssetMgtConfiguration
}

export type { JsonPatch }

export type PatchConfigApiPropertiesData = JsonPatch[]

export interface ConfigApiAuditPayload {
  requestBody: JsonPatch[]
}

export type ModifiedFieldsValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[]
  | null
  | undefined
  | Record<string, string | number | boolean | string[] | number[] | boolean[] | null>
  | { requestBody: JsonPatch[] }

export interface ModifiedFields {
  [key: string]: ModifiedFieldsValue
}
