import type { TFunction } from 'i18next'
import { PublicKeyCredentialHints, AttestationMode } from '../types'
import { fidoConstants } from './constants'
import { AppConfiguration1, Fido2Configuration } from 'JansConfigApi'
import type {
  DynamicConfigFormValues,
  StaticConfigFormValues,
  CreateFidoConfigPayloadParams,
  PutPropertiesFido2Params,
  FidoFormValues,
  FidoFormValuePrimitive,
} from '../types'
import type { GluuCommitDialogOperation, JsonValue } from 'Routes/Apps/Gluu/types/index'

const isStaticConfigType = (type?: string): type is typeof fidoConstants.STATIC => {
  return type === fidoConstants.STATIC
}
const isDynamicConfigType = (type?: string): type is typeof fidoConstants.DYNAMIC => {
  return type === fidoConstants.DYNAMIC
}

const toNumberOrUndefined = (value: number | string): number | undefined => {
  if (typeof value === 'string' && value.trim() === '') return undefined
  return Number(value)
}

const arrayValidationWithSchema = (
  givenArray: string[],
  schema: Record<string, string>,
): string[] =>
  Array.isArray(givenArray)
    ? givenArray.filter((value) => Object.values(schema).includes(value))
    : []

const toBooleanValue = (value: boolean | string | number | null | undefined): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    return value.toLowerCase() === fidoConstants.BINARY_VALUES.TRUE
  }
  return Boolean(value)
}

const transformStaticConfigToFormValues = (
  config: Fido2Configuration | undefined,
): StaticConfigFormValues => {
  return {
    authenticatorCertsFolder: config?.authenticatorCertsFolder || '',
    mdsCertsFolder: config?.mdsCertsFolder || '',
    mdsTocsFolder: config?.mdsTocsFolder || '',
    unfinishedRequestExpiration: config?.unfinishedRequestExpiration ?? '',
    authenticationHistoryExpiration: config?.authenticationHistoryExpiration ?? '',
    serverMetadataFolder: config?.serverMetadataFolder || '',
    userAutoEnrollment: toBooleanValue(config?.userAutoEnrollment),
    requestedParties: (config?.rp || []).map((party) => ({
      key: party.id || '',
      value: (party.origins || []).join(','),
    })),
    enabledFidoAlgorithms: config?.enabledFidoAlgorithms || [],
    metadataServers: (config?.metadataServers || []).map((server) => ({
      url: server.url || '',
      rootCert: server.rootCert || '',
    })),
    disableMetadataService: toBooleanValue(config?.disableMetadataService),
    hints: arrayValidationWithSchema(config?.hints || [], PublicKeyCredentialHints),
    enterpriseAttestation: toBooleanValue(config?.enterpriseAttestation),
    attestationMode: (() => {
      const mode = (config?.attestationMode as string) || ''
      const validModes = Object.values(AttestationMode)
      return validModes.includes(mode as AttestationMode) ? mode : ''
    })(),
  }
}

const transformDynamicConfigToFormValues = (
  config: AppConfiguration1 | undefined,
): DynamicConfigFormValues => {
  return {
    issuer: config?.issuer || '',
    baseEndpoint: config?.baseEndpoint || '',
    cleanServiceInterval: config?.cleanServiceInterval ?? '',
    cleanServiceBatchChunkSize: config?.cleanServiceBatchChunkSize ?? '',
    useLocalCache: toBooleanValue(config?.useLocalCache),
    disableJdkLogger: toBooleanValue(config?.disableJdkLogger),
    loggingLevel: config?.loggingLevel || '',
    loggingLayout: config?.loggingLayout || '',
    metricReporterEnabled: toBooleanValue(config?.metricReporterEnabled),
    metricReporterInterval: config?.metricReporterInterval ?? '',
    metricReporterKeepDataDays: config?.metricReporterKeepDataDays ?? '',
    personCustomObjectClassList: config?.personCustomObjectClassList || [],
    fido2MetricsEnabled: toBooleanValue(config?.fido2MetricsEnabled),
    fido2MetricsRetentionDays: config?.fido2MetricsRetentionDays ?? '',
    fido2DeviceInfoCollection: toBooleanValue(config?.fido2DeviceInfoCollection),
    fido2ErrorCategorization: toBooleanValue(config?.fido2ErrorCategorization),
    fido2PerformanceMetrics: toBooleanValue(config?.fido2PerformanceMetrics),
  }
}

const transformToFormValues = (
  configuration: AppConfiguration1 | Fido2Configuration | undefined,
  type?: string,
): DynamicConfigFormValues | StaticConfigFormValues => {
  if (isStaticConfigType(type)) {
    return transformStaticConfigToFormValues(configuration as Fido2Configuration | undefined)
  }
  if (isDynamicConfigType(type)) {
    return transformDynamicConfigToFormValues(configuration as AppConfiguration1 | undefined)
  }
  return transformDynamicConfigToFormValues(configuration as AppConfiguration1 | undefined)
}

const applyStaticConfigChanges = (
  payload: AppConfiguration1,
  staticData: StaticConfigFormValues,
): void => {
  payload.fido2Configuration ??= {}

  payload.fido2Configuration.authenticatorCertsFolder = staticData.authenticatorCertsFolder
  payload.fido2Configuration.mdsCertsFolder = staticData.mdsCertsFolder
  payload.fido2Configuration.mdsTocsFolder = staticData.mdsTocsFolder
  payload.fido2Configuration.unfinishedRequestExpiration = toNumberOrUndefined(
    staticData.unfinishedRequestExpiration,
  )
  payload.fido2Configuration.authenticationHistoryExpiration = toNumberOrUndefined(
    staticData.authenticationHistoryExpiration,
  )
  payload.fido2Configuration.serverMetadataFolder = staticData.serverMetadataFolder
  payload.fido2Configuration.userAutoEnrollment = staticData.userAutoEnrollment
  payload.fido2Configuration.rp = staticData.requestedParties.map((item) => ({
    id: item.key,
    origins: item.value
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0),
  }))
  payload.fido2Configuration.enabledFidoAlgorithms = staticData.enabledFidoAlgorithms
  payload.fido2Configuration.metadataServers = staticData.metadataServers.map((server) => ({
    url: server.url,
    rootCert: server.rootCert,
  }))
  payload.fido2Configuration.disableMetadataService = staticData.disableMetadataService
  payload.fido2Configuration.hints = staticData.hints || []
  payload.fido2Configuration.enterpriseAttestation = staticData.enterpriseAttestation
  payload.fido2Configuration.attestationMode = staticData.attestationMode
}

const applyDynamicConfigChanges = (
  payload: AppConfiguration1,
  dynamicData: DynamicConfigFormValues,
): void => {
  payload.issuer = dynamicData.issuer
  payload.baseEndpoint = dynamicData.baseEndpoint
  payload.cleanServiceInterval = toNumberOrUndefined(dynamicData.cleanServiceInterval)
  payload.cleanServiceBatchChunkSize = toNumberOrUndefined(dynamicData.cleanServiceBatchChunkSize)
  payload.useLocalCache = dynamicData.useLocalCache
  payload.disableJdkLogger = dynamicData.disableJdkLogger
  payload.loggingLevel = dynamicData.loggingLevel
  payload.loggingLayout = dynamicData.loggingLayout
  payload.metricReporterEnabled = dynamicData.metricReporterEnabled
  payload.metricReporterInterval = toNumberOrUndefined(dynamicData.metricReporterInterval)
  payload.metricReporterKeepDataDays = toNumberOrUndefined(dynamicData.metricReporterKeepDataDays)
  payload.personCustomObjectClassList = dynamicData.personCustomObjectClassList
  payload.fido2MetricsEnabled = dynamicData.fido2MetricsEnabled
  payload.fido2MetricsRetentionDays = toNumberOrUndefined(dynamicData.fido2MetricsRetentionDays)
  payload.fido2DeviceInfoCollection = dynamicData.fido2DeviceInfoCollection
  payload.fido2ErrorCategorization = dynamicData.fido2ErrorCategorization
  payload.fido2PerformanceMetrics = dynamicData.fido2PerformanceMetrics
}

const createFidoConfigPayload = ({
  fidoConfiguration,
  data,
  type,
}: CreateFidoConfigPayloadParams): PutPropertiesFido2Params => {
  const payload: AppConfiguration1 =
    typeof structuredClone === 'function'
      ? structuredClone(fidoConfiguration)
      : { ...fidoConfiguration, fido2Configuration: { ...fidoConfiguration.fido2Configuration } }

  if (isStaticConfigType(type)) {
    applyStaticConfigChanges(payload, data as StaticConfigFormValues)
  } else if (isDynamicConfigType(type)) {
    applyDynamicConfigChanges(payload, data as DynamicConfigFormValues)
  }

  return {
    data: payload,
  }
}

const getModifiedFields = (
  newData: FidoFormValues,
  originalConfiguration: AppConfiguration1 | Fido2Configuration | undefined,
  type: string,
): Record<string, FidoFormValuePrimitive> => {
  const modifiedFields: Record<string, FidoFormValuePrimitive> = {}
  const originalData =
    type === fidoConstants.STATIC
      ? transformStaticConfigToFormValues(originalConfiguration as Fido2Configuration | undefined)
      : transformDynamicConfigToFormValues(originalConfiguration as AppConfiguration1 | undefined)

  const newRecord: Record<string, FidoFormValuePrimitive> = Object.fromEntries(
    Object.entries(newData),
  )
  const oldRecord: Record<string, FidoFormValuePrimitive> = Object.fromEntries(
    Object.entries(originalData),
  )

  Object.keys(newRecord).forEach((key) => {
    const newValue = newRecord[key]
    const oldValue = oldRecord[key]

    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      modifiedFields[key] = newValue
    }
  })

  return modifiedFields
}

const DYNAMIC_FIELD_LABELS: Record<string, string> = {
  issuer: fidoConstants.LABELS.ISSUER,
  baseEndpoint: fidoConstants.LABELS.BASE_ENDPOINT,
  cleanServiceInterval: fidoConstants.LABELS.CLEAN_SERVICE_INTERVAL,
  cleanServiceBatchChunkSize: fidoConstants.LABELS.CLEAN_SERVICE_BATCH_CHUNK,
  useLocalCache: fidoConstants.LABELS.USE_LOCAL_CACHE,
  disableJdkLogger: fidoConstants.LABELS.DISABLE_JDK_LOGGER,
  loggingLevel: fidoConstants.LABELS.LOGGING_LEVEL,
  loggingLayout: fidoConstants.LABELS.LOGGING_LAYOUT,
  metricReporterInterval: fidoConstants.LABELS.METRIC_REPORTER_INTERVAL,
  metricReporterKeepDataDays: fidoConstants.LABELS.METRIC_REPORTER_KEEP_DATA_DAYS,
  metricReporterEnabled: fidoConstants.LABELS.METRIC_REPORTER_ENABLED,
  personCustomObjectClassList: fidoConstants.LABELS.PERSON_CUSTOM_OBJECT_CLASSES,
  fido2MetricsEnabled: fidoConstants.LABELS.FIDO2_METRICS_ENABLED,
  fido2MetricsRetentionDays: fidoConstants.LABELS.FIDO2_METRICS_RETENTION_DAYS,
  fido2DeviceInfoCollection: fidoConstants.LABELS.FIDO2_DEVICE_INFO_COLLECTION,
  fido2ErrorCategorization: fidoConstants.LABELS.FIDO2_ERROR_CATEGORIZATION,
  fido2PerformanceMetrics: fidoConstants.LABELS.FIDO2_PERFORMANCE_METRICS,
}

const STATIC_FIELD_LABELS: Record<string, string> = {
  authenticatorCertsFolder: fidoConstants.LABELS.AUTHENTICATOR_CERTIFICATES_FOLDER,
  mdsCertsFolder: fidoConstants.LABELS.MDS_TOC_CERTIFICATES_FOLDER,
  mdsTocsFolder: fidoConstants.LABELS.MDS_TOC_FILES_FOLDER,
  unfinishedRequestExpiration: fidoConstants.LABELS.UNFINISHED_REQUEST_EXPIRATION,
  authenticationHistoryExpiration: fidoConstants.LABELS.AUTHENTICATION_HISTORY_EXPIRATION,
  serverMetadataFolder: fidoConstants.LABELS.SERVER_METADATA_FOLDER,
  userAutoEnrollment: fidoConstants.LABELS.USER_AUTO_ENROLLMENT,
  requestedParties: fidoConstants.LABELS.REQUESTED_PARTIES_ID,
  enabledFidoAlgorithms: fidoConstants.LABELS.ENABLED_FIDO_ALGORITHMS,
  metadataServers: fidoConstants.LABELS.METADATA_SERVERS,
  disableMetadataService: fidoConstants.LABELS.DISABLE_METADATA_SERVICE,
  hints: fidoConstants.LABELS.HINTS,
  enterpriseAttestation: fidoConstants.LABELS.ENTERPRISE_ATTESTATION,
  attestationMode: fidoConstants.LABELS.ATTESTATION_MODE,
}

const formatValue = (value: FidoFormValuePrimitive | undefined): JsonValue => {
  if (value === null || value === undefined) return null
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
    return value
  if (Array.isArray(value)) {
    if (value.length === 0) return '(empty)'
    return value
      .map((item) =>
        typeof item === 'object' && item !== null
          ? Object.values(item).filter(Boolean).join(', ')
          : String(item),
      )
      .join('; ')
  }
  return JSON.stringify(value)
}

const buildChangedFieldOperations = (
  initialValues: FidoFormValues,
  currentValues: FidoFormValues,
  type: string,
  t: TFunction,
): GluuCommitDialogOperation[] => {
  const operations: GluuCommitDialogOperation[] = []
  const fieldLabels = type === fidoConstants.STATIC ? STATIC_FIELD_LABELS : DYNAMIC_FIELD_LABELS

  const oldRecord: Record<string, FidoFormValuePrimitive> = Object.fromEntries(
    Object.entries(initialValues),
  )
  const newRecord: Record<string, FidoFormValuePrimitive> = Object.fromEntries(
    Object.entries(currentValues),
  )

  for (const key of Object.keys(newRecord)) {
    const oldValue = oldRecord[key]
    const newValue = newRecord[key]

    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      const labelKey = fieldLabels[key]
      const label = labelKey ? t(labelKey) : key
      operations.push({ path: label, value: formatValue(newValue) })
    }
  }

  return operations
}

export {
  transformToFormValues,
  createFidoConfigPayload,
  getModifiedFields,
  buildChangedFieldOperations,
}
