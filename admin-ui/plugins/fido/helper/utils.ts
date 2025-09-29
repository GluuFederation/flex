import {
  PublicKeyCredentialHints,
  AppConfiguration,
  RequestedParty,
  Fido2Configuration,
} from '../types'
import { StaticConfigurationFormValues } from '../components/types/StaticConfiguration'
import { DynamicConfigFormValues } from '../components/types/DynamicConfiguration'
import { fidoConstants } from './constants'

const arrayValidationWithSchema = (givenArray: string[], schema: Record<string, string>) =>
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

type ConfigKind = typeof fidoConstants.STATIC | typeof fidoConstants.DYNAMIC

// Type guards for runtime safety
const isStaticConfigType = (type: string): type is typeof fidoConstants.STATIC =>
  type === fidoConstants.STATIC

const isDynamicConfigType = (type: string): type is typeof fidoConstants.DYNAMIC =>
  type === fidoConstants.DYNAMIC

const isValidConfigType = (type: string): type is ConfigKind =>
  isStaticConfigType(type) || isDynamicConfigType(type)

// Improved function overloads with stronger type safety
function transformToFormValues(
  configuration: AppConfiguration | undefined,
  type: typeof fidoConstants.STATIC,
): StaticConfigurationFormValues
function transformToFormValues(
  configuration: AppConfiguration | undefined,
  type: typeof fidoConstants.DYNAMIC,
): DynamicConfigFormValues
function transformToFormValues(
  configuration: AppConfiguration | undefined,
  type: ConfigKind,
): StaticConfigurationFormValues | DynamicConfigFormValues {
  const fido2Config: Fido2Configuration = configuration?.fido2Configuration || {}
  return type === fidoConstants.STATIC
    ? {
        authenticatorCertsFolder: fido2Config?.authenticatorCertsFolder || '',
        mdsCertsFolder: fido2Config?.mdsCertsFolder || '',
        mdsTocsFolder: fido2Config?.mdsTocsFolder || '',
        unfinishedRequestExpiration: fido2Config?.unfinishedRequestExpiration || 0,
        checkU2fAttestations: toBooleanValue((fido2Config as any)?.checkU2fAttestations),
        metadataRefreshInterval: fido2Config?.metadataRefreshInterval || 0,
        serverMetadataFolder: fido2Config?.serverMetadataFolder || '',
        userAutoEnrollment: toBooleanValue(fido2Config?.userAutoEnrollment),
        enabledFidoAlgorithms: fido2Config?.enabledFidoAlgorithms || [],
        rp: ((fido2Config?.rp as RequestedParty[]) || []).map((party: RequestedParty) => ({
          name: party?.name || party?.id || '',
          domains: party?.domains || party?.origins || [],
        })),
      }
    : {
        issuer: configuration?.issuer || '',
        baseEndpoint: configuration?.baseEndpoint || '',
        cleanServiceInterval: configuration?.cleanServiceInterval || '',
        cleanServiceBatchChunkSize: configuration?.cleanServiceBatchChunkSize || '',
        useLocalCache: toBooleanValue(configuration?.useLocalCache),
        disableJdkLogger: toBooleanValue(configuration?.disableJdkLogger),
        loggingLevel: configuration?.loggingLevel || '',
        loggingLayout: configuration?.loggingLayout || '',
        externalLoggerConfiguration: configuration?.externalLoggerConfiguration || '',
        metricReporterEnabled: toBooleanValue(configuration?.metricReporterEnabled),
        metricReporterInterval: configuration?.metricReporterInterval || '',
        metricReporterKeepDataDays: configuration?.metricReporterKeepDataDays || '',
        personCustomObjectClassList: configuration?.personCustomObjectClassList || [],
        hints: arrayValidationWithSchema(fido2Config?.hints || [], PublicKeyCredentialHints),
      }
}

// Improved discriminated union interfaces with stronger type constraints
interface CreateStaticFidoConfigPayloadParams {
  readonly fidoConfiguration: { fido: AppConfiguration }
  readonly data: StaticConfigurationFormValues
  readonly type: typeof fidoConstants.STATIC
}

interface CreateDynamicFidoConfigPayloadParams {
  readonly fidoConfiguration: { fido: AppConfiguration }
  readonly data: DynamicConfigFormValues
  readonly type: typeof fidoConstants.DYNAMIC
}

// Discriminated union that ensures type safety at compile time
type CreateFidoConfigPayloadParams =
  | CreateStaticFidoConfigPayloadParams
  | CreateDynamicFidoConfigPayloadParams

// Type predicate functions for runtime type narrowing
const isStaticPayloadParams = (
  params: CreateFidoConfigPayloadParams,
): params is CreateStaticFidoConfigPayloadParams => params.type === fidoConstants.STATIC

const isDynamicPayloadParams = (
  params: CreateFidoConfigPayloadParams,
): params is CreateDynamicFidoConfigPayloadParams => params.type === fidoConstants.DYNAMIC

// Helper function to handle static configuration mapping
const mapStaticConfigToPayload = (
  payload: AppConfiguration,
  staticData: StaticConfigurationFormValues,
): void => {
  if (!payload.fido2Configuration) return

  payload.fido2Configuration.authenticatorCertsFolder = staticData.authenticatorCertsFolder
  payload.fido2Configuration.mdsCertsFolder = staticData.mdsCertsFolder
  payload.fido2Configuration.mdsTocsFolder = staticData.mdsTocsFolder
  payload.fido2Configuration.unfinishedRequestExpiration =
    typeof staticData.unfinishedRequestExpiration === 'string'
      ? Number(staticData.unfinishedRequestExpiration)
      : staticData.unfinishedRequestExpiration
  payload.fido2Configuration.metadataRefreshInterval =
    typeof staticData.metadataRefreshInterval === 'string'
      ? Number(staticData.metadataRefreshInterval)
      : staticData.metadataRefreshInterval
  payload.fido2Configuration.serverMetadataFolder = staticData.serverMetadataFolder
  payload.fido2Configuration.userAutoEnrollment = staticData.userAutoEnrollment
  payload.fido2Configuration.enabledFidoAlgorithms = staticData.enabledFidoAlgorithms

  // Handle rp mapping
  payload.fido2Configuration.rp =
    staticData.rp?.map((party) => ({
      name: party.name || '',
      domains: party.domains || [],
    })) || []

  // Handle additional properties that may exist on the payload but not in types
  if ('checkU2fAttestations' in staticData) {
    ;(payload.fido2Configuration as any).checkU2fAttestations = staticData.checkU2fAttestations
  }
  if ('authenticationHistoryExpiration' in staticData) {
    ;(payload.fido2Configuration as any).authenticationHistoryExpiration = (
      staticData as any
    ).authenticationHistoryExpiration
  }
  if ('requestedCredentialTypes' in staticData) {
    ;(payload.fido2Configuration as any).requestedCredentialTypes = (
      (staticData as any).requestedCredentialTypes as Array<{ value?: string } | string>
    ).map((item) => (typeof item === 'object' && item?.value ? item.value : (item as string)))
  }
}

// Helper function to handle dynamic configuration mapping
const mapDynamicConfigToPayload = (
  payload: AppConfiguration,
  dynamicData: DynamicConfigFormValues,
): void => {
  payload.issuer = dynamicData.issuer
  payload.baseEndpoint = dynamicData.baseEndpoint
  payload.cleanServiceInterval =
    typeof dynamicData.cleanServiceInterval === 'string'
      ? Number(dynamicData.cleanServiceInterval)
      : dynamicData.cleanServiceInterval
  payload.cleanServiceBatchChunkSize =
    typeof dynamicData.cleanServiceBatchChunkSize === 'string'
      ? Number(dynamicData.cleanServiceBatchChunkSize)
      : dynamicData.cleanServiceBatchChunkSize
  payload.useLocalCache = dynamicData.useLocalCache
  payload.disableJdkLogger = dynamicData.disableJdkLogger
  payload.loggingLevel = dynamicData.loggingLevel
  payload.loggingLayout = dynamicData.loggingLayout
  payload.externalLoggerConfiguration = dynamicData.externalLoggerConfiguration
  payload.metricReporterEnabled = dynamicData.metricReporterEnabled
  payload.metricReporterInterval =
    typeof dynamicData.metricReporterInterval === 'string'
      ? Number(dynamicData.metricReporterInterval)
      : dynamicData.metricReporterInterval
  payload.metricReporterKeepDataDays =
    typeof dynamicData.metricReporterKeepDataDays === 'string'
      ? Number(dynamicData.metricReporterKeepDataDays)
      : dynamicData.metricReporterKeepDataDays
  payload.personCustomObjectClassList = dynamicData.personCustomObjectClassList

  if (payload.fido2Configuration) {
    payload.fido2Configuration.hints = dynamicData.hints || []
  }
}

const createFidoConfigPayload = (params: CreateFidoConfigPayloadParams) => {
  const { fidoConfiguration, type } = params

  // Validate input type at runtime
  if (!isValidConfigType(type)) {
    throw new Error(
      `Invalid configuration type: ${type}. Expected '${fidoConstants.STATIC}' or '${fidoConstants.DYNAMIC}'`,
    )
  }

  const payload: AppConfiguration = {
    ...fidoConfiguration.fido,
    ...(fidoConfiguration.fido.fido2Configuration && {
      fido2Configuration: { ...fidoConfiguration.fido.fido2Configuration },
    }),
  }

  // Use type predicates for compile-time type narrowing
  if (isStaticPayloadParams(params)) {
    mapStaticConfigToPayload(payload, params.data)
  } else if (isDynamicPayloadParams(params)) {
    mapDynamicConfigToPayload(payload, params.data)
  } else {
    // Exhaustive check - this should never happen due to the runtime validation above
    const _exhaustiveCheck: never = params
    throw new Error(`Unhandled configuration type: ${(_exhaustiveCheck as any).type}`)
  }

  const opts: Record<string, unknown> = {}
  opts['appConfiguration'] = payload
  return opts
}

export {
  arrayValidationWithSchema,
  transformToFormValues,
  createFidoConfigPayload,
  getAvailableHintOptions,
  getEmptyDropdownMessage,
  toBooleanValue,
  isStaticConfigType,
  isDynamicConfigType,
  isValidConfigType,
  isStaticPayloadParams,
  isDynamicPayloadParams,
}

export type {
  ConfigKind,
  CreateFidoConfigPayloadParams,
  CreateStaticFidoConfigPayloadParams,
  CreateDynamicFidoConfigPayloadParams,
}
