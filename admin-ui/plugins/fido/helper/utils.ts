import { PublicKeyCredentialHints, AttestationMode } from '../types'
import { fidoConstants } from './constants'
import { AppConfiguration1, Fido2Configuration } from 'JansConfigApi'
import {
  DynamicConfigFormValues,
  StaticConfigFormValues,
  CreateFidoConfigPayloadParams,
  PutPropertiesFido2Params,
} from '../types/fido'

const isStaticConfigType = (type?: string): type is typeof fidoConstants.STATIC => {
  return type === fidoConstants.STATIC
}
const isDynamicConfigType = (type?: string): type is typeof fidoConstants.DYNAMIC => {
  return type === fidoConstants.DYNAMIC
}

const arrayValidationWithSchema = (
  givenArray: string[],
  schema: Record<string, string>,
): string[] =>
  Array.isArray(givenArray)
    ? givenArray.filter((value) => Object.values(schema).includes(value))
    : []

const getAvailableHintOptions = (selectedHints: string[] = []): string[] => {
  return Object.values(PublicKeyCredentialHints).filter((hint) => !selectedHints.includes(hint))
}

const areAllHintsSelected = (selectedHints: string[] = []): boolean => {
  return Object.values(PublicKeyCredentialHints).length === selectedHints.length
}

const getEmptyDropdownMessage = (selectedHints: string[] = []): string => {
  return areAllHintsSelected(selectedHints)
    ? fidoConstants.EMPTY_DROPDOWN_MESSAGE.ALL_AVAILABLE_HINTS_SELECTED
    : fidoConstants.EMPTY_DROPDOWN_MESSAGE.NO_MATCHING_OPTIONS
}

const toBooleanValue = (value: unknown): boolean => {
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
  payload.fido2Configuration.unfinishedRequestExpiration =
    typeof staticData.unfinishedRequestExpiration === 'string' &&
    staticData.unfinishedRequestExpiration.trim() === ''
      ? undefined
      : Number(staticData.unfinishedRequestExpiration)
  payload.fido2Configuration.authenticationHistoryExpiration =
    typeof staticData.authenticationHistoryExpiration === 'string' &&
    staticData.authenticationHistoryExpiration.trim() === ''
      ? undefined
      : Number(staticData.authenticationHistoryExpiration)
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
  payload.cleanServiceInterval =
    typeof dynamicData.cleanServiceInterval === 'string' &&
    dynamicData.cleanServiceInterval.trim() === ''
      ? undefined
      : Number(dynamicData.cleanServiceInterval)
  payload.cleanServiceBatchChunkSize =
    typeof dynamicData.cleanServiceBatchChunkSize === 'string' &&
    dynamicData.cleanServiceBatchChunkSize.trim() === ''
      ? undefined
      : Number(dynamicData.cleanServiceBatchChunkSize)
  payload.useLocalCache = dynamicData.useLocalCache
  payload.disableJdkLogger = dynamicData.disableJdkLogger
  payload.loggingLevel = dynamicData.loggingLevel
  payload.loggingLayout = dynamicData.loggingLayout
  payload.metricReporterEnabled = dynamicData.metricReporterEnabled
  payload.metricReporterInterval =
    typeof dynamicData.metricReporterInterval === 'string' &&
    dynamicData.metricReporterInterval.trim() === ''
      ? undefined
      : Number(dynamicData.metricReporterInterval)
  payload.metricReporterKeepDataDays =
    typeof dynamicData.metricReporterKeepDataDays === 'string' &&
    dynamicData.metricReporterKeepDataDays.trim() === ''
      ? undefined
      : Number(dynamicData.metricReporterKeepDataDays)
  payload.personCustomObjectClassList = dynamicData.personCustomObjectClassList
  payload.fido2MetricsEnabled = dynamicData.fido2MetricsEnabled
  payload.fido2MetricsRetentionDays =
    typeof dynamicData.fido2MetricsRetentionDays === 'string' &&
    dynamicData.fido2MetricsRetentionDays.trim() === ''
      ? undefined
      : Number(dynamicData.fido2MetricsRetentionDays)
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
  newData: DynamicConfigFormValues | StaticConfigFormValues,
  originalConfiguration: AppConfiguration1 | Fido2Configuration | undefined,
  type: string,
): Record<string, unknown> => {
  const modifiedFields: Record<string, unknown> = {}
  const originalData =
    type === fidoConstants.STATIC
      ? transformStaticConfigToFormValues(originalConfiguration as Fido2Configuration | undefined)
      : transformDynamicConfigToFormValues(originalConfiguration as AppConfiguration1 | undefined)

  Object.keys(newData).forEach((key) => {
    const newValue = (newData as unknown as Record<string, unknown>)[key]
    const oldValue = (originalData as unknown as Record<string, unknown>)[key]

    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      modifiedFields[key] = newValue
    }
  })

  return modifiedFields
}

export {
  arrayValidationWithSchema,
  transformToFormValues,
  createFidoConfigPayload,
  getAvailableHintOptions,
  getEmptyDropdownMessage,
  toBooleanValue,
  getModifiedFields,
}
