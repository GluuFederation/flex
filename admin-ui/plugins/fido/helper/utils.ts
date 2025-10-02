import { PublicKeyCredentialHints } from '../types'
import { fidoConstants } from './constants'
import { AppConfiguration1, Fido2Configuration } from 'JansConfigApi'
import {
  DynamicConfigFormValues,
  StaticConfigFormValues,
  CreateFidoConfigPayloadParams,
  PutPropertiesFido2Params,
} from '../types/fido-types'

// Type guard for static configuration
const isStaticConfigType = (type: string): type is typeof fidoConstants.STATIC => {
  return type === fidoConstants.STATIC
}

// Type guard for dynamic configuration
const isDynamicConfigType = (type: string): type is typeof fidoConstants.DYNAMIC => {
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

// Transform static configuration to form values
const transformStaticConfigToFormValues = (
  config: Fido2Configuration | undefined,
): StaticConfigFormValues => {
  return {
    authenticatorCertsFolder: config?.authenticatorCertsFolder || '',
    mdsCertsFolder: config?.mdsCertsFolder || '',
    mdsTocsFolder: config?.mdsTocsFolder || '',
    checkU2fAttestations: toBooleanValue(config?.checkU2fAttestations),
    unfinishedRequestExpiration: config?.unfinishedRequestExpiration || '',
    authenticationHistoryExpiration: config?.authenticationHistoryExpiration || '',
    serverMetadataFolder: config?.serverMetadataFolder || '',
    userAutoEnrollment: toBooleanValue(config?.userAutoEnrollment),
    requestedCredentialTypes: [],
    requestedParties: (config?.rp || []).map((party) => ({
      key: party.id || '',
      value: (party.origins || []).join(','),
    })),
  }
}

// Transform dynamic configuration to form values
const transformDynamicConfigToFormValues = (
  config: AppConfiguration1 | undefined,
): DynamicConfigFormValues => {
  return {
    issuer: config?.issuer || '',
    baseEndpoint: config?.baseEndpoint || '',
    cleanServiceInterval: config?.cleanServiceInterval || '',
    cleanServiceBatchChunkSize: config?.cleanServiceBatchChunkSize || '',
    useLocalCache: toBooleanValue(config?.useLocalCache),
    disableJdkLogger: toBooleanValue(config?.disableJdkLogger),
    loggingLevel: config?.loggingLevel || '',
    loggingLayout: config?.loggingLayout || '',
    externalLoggerConfiguration: config?.externalLoggerConfiguration || '',
    metricReporterEnabled: toBooleanValue(config?.metricReporterEnabled),
    metricReporterInterval: config?.metricReporterInterval || '',
    metricReporterKeepDataDays: config?.metricReporterKeepDataDays || '',
    personCustomObjectClassList: config?.personCustomObjectClassList || [],
    hints: arrayValidationWithSchema(
      config?.fido2Configuration?.hints || [],
      PublicKeyCredentialHints,
    ),
  }
}

// Main transform function with type guards
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

  // Default to dynamic config
  return transformDynamicConfigToFormValues(configuration as AppConfiguration1 | undefined)
}

// Apply static configuration changes to payload
const applyStaticConfigChanges = (
  payload: AppConfiguration1,
  staticData: StaticConfigFormValues,
): void => {
  if (!payload.fido2Configuration) {
    payload.fido2Configuration = {}
  }

  payload.fido2Configuration.authenticatorCertsFolder = staticData.authenticatorCertsFolder
  payload.fido2Configuration.mdsCertsFolder = staticData.mdsCertsFolder
  payload.fido2Configuration.mdsTocsFolder = staticData.mdsTocsFolder
  payload.fido2Configuration.checkU2fAttestations = staticData.checkU2fAttestations
  payload.fido2Configuration.unfinishedRequestExpiration = Number(
    staticData.unfinishedRequestExpiration,
  )
  payload.fido2Configuration.authenticationHistoryExpiration = Number(
    staticData.authenticationHistoryExpiration,
  )
  payload.fido2Configuration.serverMetadataFolder = staticData.serverMetadataFolder
  payload.fido2Configuration.userAutoEnrollment = staticData.userAutoEnrollment
  payload.fido2Configuration.rp = staticData.requestedParties.map((item) => ({
    id: item.key,
    origins: [item.value],
  }))
}

// Apply dynamic configuration changes to payload
const applyDynamicConfigChanges = (
  payload: AppConfiguration1,
  dynamicData: DynamicConfigFormValues,
): void => {
  payload.issuer = dynamicData.issuer
  payload.baseEndpoint = dynamicData.baseEndpoint
  payload.cleanServiceInterval = Number(dynamicData.cleanServiceInterval)
  payload.cleanServiceBatchChunkSize = Number(dynamicData.cleanServiceBatchChunkSize)
  payload.useLocalCache = dynamicData.useLocalCache
  payload.disableJdkLogger = dynamicData.disableJdkLogger
  payload.loggingLevel = dynamicData.loggingLevel
  payload.loggingLayout = dynamicData.loggingLayout
  payload.externalLoggerConfiguration = dynamicData.externalLoggerConfiguration
  payload.metricReporterEnabled = dynamicData.metricReporterEnabled
  payload.metricReporterInterval = Number(dynamicData.metricReporterInterval)
  payload.metricReporterKeepDataDays = Number(dynamicData.metricReporterKeepDataDays)
  payload.personCustomObjectClassList = dynamicData.personCustomObjectClassList.map((item) =>
    typeof item === 'string' ? item : item.value,
  )

  if (!payload.fido2Configuration) {
    payload.fido2Configuration = {}
  }
  payload.fido2Configuration.hints = dynamicData.hints || []
}

const createFidoConfigPayload = ({
  fidoConfiguration,
  data,
  type,
}: CreateFidoConfigPayloadParams): PutPropertiesFido2Params => {
  // Use structuredClone (modern browsers) or fallback to spread operator
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
    appConfiguration1: payload,
  }
}

export {
  arrayValidationWithSchema,
  transformToFormValues,
  createFidoConfigPayload,
  getAvailableHintOptions,
  getEmptyDropdownMessage,
  toBooleanValue,
}
