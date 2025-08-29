export enum PublicKeyCredentialHints {
  SECURITY_KEY = 'security-key',
  CLIENT_DEVICE = 'client-device',
  HYBRID = 'hybrid',
}

export interface MetadataServer {
  url?: string
  rootCert?: string
}

export interface RequestedParty {
  id?: string
  name?: string
  domains?: string[]
  origins?: string[]
}
export interface Fido2Configuration {
  authenticatorCertsFolder?: string
  mdsCertsFolder?: string
  mdsTocsFolder?: string
  userAutoEnrollment?: boolean
  unfinishedRequestExpiration?: number
  metadataRefreshInterval?: number
  serverMetadataFolder?: string
  enabledFidoAlgorithms?: string[]
  metadataServers?: MetadataServer[]
  disableMetadataService?: boolean
  hints?: string[]
  enterpriseAttestation?: boolean
  attestationMode?: string
  rp?: RequestedParty[]
}

export interface AppConfiguration {
  issuer?: string
  baseEndpoint?: string
  cleanServiceInterval?: number
  cleanServiceBatchChunkSize?: number
  useLocalCache?: boolean
  disableJdkLogger?: boolean
  loggingLevel?: string
  loggingLayout?: string
  externalLoggerConfiguration?: string
  metricReporterInterval?: number
  metricReporterKeepDataDays?: number
  metricReporterEnabled?: boolean
  personCustomObjectClassList?: string[]
  sessionIdPersistInCache?: boolean
  errorReasonEnabled?: boolean
  fido2Configuration?: Fido2Configuration
}

export interface PutPropertiesFido2Options {
  appConfiguration?: AppConfiguration
}

export interface SmtpTest {
  sign?: boolean
  subject?: string
  message?: string
}

export interface SearchFido2RegistrationOptions {
  limit?: number
  pattern?: string
  startIndex?: number
  sortBy?: string
  sortOrder?: string
  fieldValuePair?: string
}

export interface DeleteFido2DeviceInput {
  jansId: string
}

export interface TestSmtpConfigInput {
  smtpTest: SmtpTest
}

export interface IFido2ConfigurationApi {
  getPropertiesFido2(callback: ApiCallback<AppConfiguration>): void
  putPropertiesFido2(
    opts: { appConfiguration?: AppConfiguration },
    callback: ApiCallback<AppConfiguration>,
  ): void
}

export interface IFido2RegistrationApi {
  deleteFido2Data(jansId: string, callback: ApiCallback<void>): void
}

export interface IFido2Api {
  getPropertiesFido2(): ApiPromise<AppConfiguration>
  putPropertiesFido2(input: PutPropertiesFido2Options): ApiPromise<AppConfiguration>
  deleteFido2DeviceData(input: DeleteFido2DeviceInput): ApiPromise<void>
}

export type ApiCallback<T> = (error: Error | null, data?: T, response?: unknown) => void
export type ApiPromise<T> = Promise<T>

// Define local RootState interface for this fido saga
export interface RootState {
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string | null
  }
}
export interface UpdateFidoAction {
  type: string
  payload: AppConfiguration
}

export interface DeleteFido2DeviceAction {
  type: string
  payload: DeleteFido2DeviceInput
}

export interface ApiError extends Error {
  response?: {
    data?: {
      description?: string
      message?: string
    }
  }
}

export interface ErrorToastAction {
  error: ApiError
}

export interface FidoState {
  fido: AppConfiguration
  loading: boolean
}

export interface FidoRootState {
  fidoReducer: FidoState
}

export interface TabName {
  name: string
  path: string
}

export interface FidoConfigurationProps {
  fidoConfiguration: FidoState
  handleSubmit: (data: FormData) => void
}

export interface FormData {
  [key: string]: string | number | boolean | string[] | KeyValuePair[]
}

export interface KeyValuePair {
  key: string
  value: string
}
