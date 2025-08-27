import { PublicKeyCredentialHints, AppConfiguration1, RequestedParty } from '../types'
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

const transformToFormValues = (
  configuration?: AppConfiguration1 | Record<string, unknown>,
  type?: string,
) => {
  const fido2Config =
    (configuration as AppConfiguration1)?.fido2Configuration ||
    ((configuration as Record<string, unknown>)?.fido2Configuration as Record<string, unknown>) ||
    ({} as Record<string, unknown>)
  return type === fidoConstants.STATIC
    ? {
        authenticatorCertsFolder:
          ((fido2Config as Record<string, unknown>)?.authenticatorCertsFolder as string) || '',
        mdsCertsFolder: ((fido2Config as Record<string, unknown>)?.mdsCertsFolder as string) || '',
        mdsTocsFolder: ((fido2Config as Record<string, unknown>)?.mdsTocsFolder as string) || '',
        checkU2fAttestations: toBooleanValue(
          (fido2Config as Record<string, unknown>)?.checkU2fAttestations,
        ),
        unfinishedRequestExpiration:
          ((fido2Config as Record<string, unknown>)?.unfinishedRequestExpiration as
            | string
            | number) || '',
        authenticationHistoryExpiration:
          ((fido2Config as Record<string, unknown>)?.authenticationHistoryExpiration as
            | string
            | number) || '',
        serverMetadataFolder:
          ((fido2Config as Record<string, unknown>)?.serverMetadataFolder as string) || '',
        userAutoEnrollment: toBooleanValue(
          (fido2Config as Record<string, unknown>)?.userAutoEnrollment,
        ),
        requestedCredentialTypes:
          ((fido2Config as Record<string, unknown>)?.requestedCredentialTypes as string[]) || [],
        requestedParties: (
          ((fido2Config as Record<string, unknown>)?.requestedParties as any[]) || []
        ).map((party: any) => ({
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
        hints: arrayValidationWithSchema(
          ((fido2Config as Record<string, unknown>)?.hints as string[]) || [],
          PublicKeyCredentialHints,
        ),
      }
}

interface CreateFidoConfigPayloadParams {
  fidoConfiguration: { fido: AppConfiguration1 }
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
