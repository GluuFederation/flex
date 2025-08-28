import {
  PublicKeyCredentialHints,
  AppConfiguration,
  RequestedParty,
  Fido2Configuration,
} from '../types'
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

const transformToFormValues = (configuration?: AppConfiguration, type?: string) => {
  const fido2Config: Fido2Configuration = configuration?.fido2Configuration || {}
  return type === fidoConstants.STATIC
    ? {
        authenticatorCertsFolder: fido2Config?.authenticatorCertsFolder || '',
        mdsCertsFolder: fido2Config?.mdsCertsFolder || '',
        mdsTocsFolder: fido2Config?.mdsTocsFolder || '',
        unfinishedRequestExpiration: fido2Config?.unfinishedRequestExpiration,
        metadataRefreshInterval: fido2Config?.metadataRefreshInterval,
        serverMetadataFolder: fido2Config?.serverMetadataFolder || '',
        userAutoEnrollment: toBooleanValue(fido2Config?.userAutoEnrollment),
        enabledFidoAlgorithms: fido2Config?.enabledFidoAlgorithms || [],
        requestedParties: ((fido2Config?.rp as any[]) || []).map((party: any) => ({
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

interface CreateFidoConfigPayloadParams {
  fidoConfiguration: { fido: AppConfiguration }
  data: Record<string, unknown>
  type: string
}

const createFidoConfigPayload = ({
  fidoConfiguration,
  data,
  type,
}: CreateFidoConfigPayloadParams) => {
  const payload = JSON.parse(JSON.stringify(fidoConfiguration.fido))
  if (type === fidoConstants.STATIC) {
    if (payload.fido2Configuration) {
      payload.fido2Configuration.authenticatorCertsFolder = data.authenticatorCertsFolder
      payload.fido2Configuration.mdsCertsFolder = data.mdsCertsFolder
      payload.fido2Configuration.mdsTocsFolder = data.mdsTocsFolder
      payload.fido2Configuration.checkU2fAttestations = data.checkU2fAttestations
      payload.fido2Configuration.unfinishedRequestExpiration = data.unfinishedRequestExpiration
      payload.fido2Configuration.authenticationHistoryExpiration =
        data.authenticationHistoryExpiration
      payload.fido2Configuration.serverMetadataFolder = data.serverMetadataFolder
      payload.fido2Configuration.userAutoEnrollment = data.userAutoEnrollment
      payload.fido2Configuration.requestedCredentialTypes = (
        data.requestedCredentialTypes as Array<{ value?: string } | string>
      ).map((item) => (typeof item === 'object' && item?.value ? item.value : (item as string)))
      payload.fido2Configuration.requestedParties = (
        data.requestedParties as Array<{ key: string; value: string }>
      ).map((item) => {
        return {
          name: item.key,
          domains: [item.value],
        }
      })
    }
  } else {
    payload.issuer = data.issuer
    payload.baseEndpoint = data.baseEndpoint
    payload.cleanServiceInterval = data.cleanServiceInterval
    payload.cleanServiceBatchChunkSize = data.cleanServiceBatchChunkSize
    payload.useLocalCache = data.useLocalCache
    payload.disableJdkLogger = data.disableJdkLogger
    payload.loggingLevel = data.loggingLevel
    payload.loggingLayout = data.loggingLayout
    payload.externalLoggerConfiguration = data.externalLoggerConfiguration
    payload.metricReporterEnabled = data.metricReporterEnabled
    payload.metricReporterInterval = data.metricReporterInterval
    payload.metricReporterKeepDataDays = data.metricReporterKeepDataDays
    payload.personCustomObjectClassList = (
      data.personCustomObjectClassList as Array<{ value?: string } | string>
    ).map((item) => (typeof item === 'object' && item?.value ? item.value : (item as string)))

    if (payload.fido2Configuration) {
      payload.fido2Configuration.hints = data.hints || []
    }
  }

  const opts: Record<string, unknown> = {}
  opts['appConfiguration1'] = payload

  return opts
}

export {
  arrayValidationWithSchema,
  transformToFormValues,
  createFidoConfigPayload,
  getAvailableHintOptions,
  getEmptyDropdownMessage,
  toBooleanValue,
}
