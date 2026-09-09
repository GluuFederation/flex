import type { JsonPatch } from 'JansConfigApi'

type CorsConfigurationFilter = {
  filterName?: string | null
  corsEnabled?: boolean | null
  corsAllowedOrigins?: string | null
  corsAllowedMethods?: string | null
  corsSupportCredentials?: boolean | null
  corsLoggingEnabled?: boolean | null
  corsPreflightMaxAge?: number | null
  corsRequestDecorate?: boolean | null
}

type AgamaConfiguration = {
  mandatoryAttributes?: string[] | null
  optionalAttributes?: string[] | null
}

type AuditLogIgnoreObjectMapping = {
  name: string
  text?: string[]
}

type AuditLogConf = {
  enabled?: boolean | null
  logData?: boolean | null
  ignoreHttpMethod?: string[] | null
  ignoreAnnotation?: string[] | null
  ignoreObjectMapping?: AuditLogIgnoreObjectMapping[] | null
  headerAttributes?: string[] | null
  auditLogFilePath?: string | null
  auditLogFileName?: string | null
  auditLogDateFormat?: string | null
}

type DataFormatConversionConf = {
  enabled?: boolean | null
  ignoreHttpMethod?: string[] | null
}

type Plugin = {
  name?: string | null
  description?: string | null
  className?: string | null
}

type AssetDirMapping = {
  directory?: string | null
  type?: string[] | null
  description?: string | null
  jansServiceModule?: string[] | null
}

type AssetMgtConfiguration = {
  assetMgtEnabled?: boolean | null
  assetServerUploadEnabled?: boolean | null
  fileExtensionValidationEnabled?: boolean | null
  moduleNameValidationEnabled?: boolean | null
  assetDirMapping?: AssetDirMapping[] | null
}

export type ApiAppConfiguration = {
  serviceName?: string | null
  configOauthEnabled?: boolean | null
  disableLoggerTimer?: boolean | null
  disableAuditLogger?: boolean | null
  customAttributeValidationEnabled?: boolean | null
  acrValidationEnabled?: boolean | null
  returnClientSecretInResponse?: boolean | null
  returnEncryptedClientSecretInResponse?: boolean | null
  apiApprovedIssuer?: string[] | null
  apiProtectionType?: string | null
  apiClientId?: string | null
  apiClientPassword?: string | null
  endpointInjectionEnabled?: boolean | null
  authIssuerUrl?: string | null
  authOpenidConfigurationUrl?: string | null
  authOpenidIntrospectionUrl?: string | null
  authOpenidTokenUrl?: string | null
  authOpenidRevokeUrl?: string | null
  exclusiveAuthScopes?: string[] | null
  corsConfigurationFilters?: CorsConfigurationFilter[] | null
  loggingLevel?: string | null
  loggingLayout?: string | null
  disableJdkLogger?: boolean | null
  disableExternalLoggerConfiguration?: boolean | null
  maxCount?: number | null
  acrExclusionList?: string[] | null
  userExclusionAttributes?: string[] | null
  userMandatoryAttributes?: string[] | null
  agamaConfiguration?: AgamaConfiguration | null
  auditLogConf?: AuditLogConf | null
  dataFormatConversionConf?: DataFormatConversionConf | null
  plugins?: Plugin[] | null
  assetMgtConfiguration?: AssetMgtConfiguration | null
}

export type { JsonPatch }

export type ConfigApiAuditPayload = {
  requestBody: JsonPatch[]
}

type ModifiedFieldsValue =
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

export type ModifiedFields = {
  [key: string]: ModifiedFieldsValue
}
