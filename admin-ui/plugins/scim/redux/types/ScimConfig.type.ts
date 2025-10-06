export enum ProtectionModeEnum {
  OAUTH = 'OAUTH',
  BYPASS = 'BYPASS',
}

export interface SCIMConfig {
  baseDN?: string
  applicationUrl?: string
  baseEndpoint?: string
  personCustomObjectClass?: string
  oxAuthIssuer?: string
  protectionMode?: ProtectionModeEnum
  maxCount?: number
  bulkMaxOperations?: number
  bulkMaxPayloadSize?: number
  userExtensionSchemaURI?: string
  loggingLevel?: string
  loggingLayout?: string
  externalLoggerConfiguration?: string
  metricReporterInterval?: number
  metricReporterKeepDataDays?: number
  metricReporterEnabled?: boolean
  disableJdkLogger?: boolean
  disableLoggerTimer?: boolean
  useLocalCache?: boolean
  skipDefinedPasswordValidation?: boolean
}

export interface ScimConfigPatchRequest {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test'
  path: string
  value?: unknown
}

export type ScimConfigPatchRequestBody = ScimConfigPatchRequest[]

export interface ScimState {
  scim: SCIMConfig | Record<string, never>
  loading: boolean
}

export interface UserAction {
  action_message?: string
  action_data?: ScimConfigPatchRequestBody
  [key: string]: unknown
}

export interface ScimActionPayload {
  action: UserAction
  [key: string]: unknown
}

export interface UpdateScimAction {
  type: 'scim/putScimConfiguration'
  payload: ScimActionPayload
}

export interface GetScimAction {
  type: 'scim/getScimConfiguration'
  payload?: Record<string, unknown>
}

export interface ScimConfigurationProps {
  handleSubmit: (data: ScimConfigPatchRequestBody, userMessage: string) => void
}

export interface ScimFormValues extends SCIMConfig {
  action_message?: string
}

export interface ScimReducerState {
  scim: SCIMConfig | Record<string, never>
  loading: boolean
}

export interface RootStateWithScim {
  scimReducer: ScimReducerState
}
