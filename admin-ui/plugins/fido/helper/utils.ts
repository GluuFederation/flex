import { PublicKeyCredentialHints } from '../types'
import { fidoConstants } from './constants'

export interface FidoRequestedParty {
  id: string
  origins: string[]
}

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

const transformToFormValues = (configuration?: Record<string, unknown>, type?: string) => {
  return type === fidoConstants.STATIC
    ? {
        authenticatorCertsFolder: configuration?.authenticatorCertsFolder || '',
        mdsCertsFolder: configuration?.mdsCertsFolder || '',
        mdsTocsFolder: configuration?.mdsTocsFolder || '',
        unfinishedRequestExpiration: configuration?.unfinishedRequestExpiration || '',
        authenticationHistoryExpiration: configuration?.authenticationHistoryExpiration || '',
        serverMetadataFolder: configuration?.serverMetadataFolder || '',
        userAutoEnrollment: toBooleanValue(configuration?.userAutoEnrollment),
        requestedCredentialTypes: configuration?.enabledFidoAlgorithms || [],
        requestedParties: Array.isArray(configuration?.rp)
          ? (configuration.rp as FidoRequestedParty[]).map((item: FidoRequestedParty) => ({
              name: item.id,
              domains: item.origins,
            }))
          : [],
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
        metricReporterEnabled: toBooleanValue(configuration?.metricReporterEnabled),
        metricReporterInterval: configuration?.metricReporterInterval || '',
        metricReporterKeepDataDays: configuration?.metricReporterKeepDataDays || '',
        personCustomObjectClassList: configuration?.personCustomObjectClassList || [],
        hints: arrayValidationWithSchema(
          (configuration as any)?.fido2Configuration?.hints,
          PublicKeyCredentialHints,
        ),
      }
}

const createFidoConfigPayload = ({ fidoConfiguration, data, type }: any) => {
  const payload = JSON.parse(JSON.stringify(fidoConfiguration.fido))
  if (type === fidoConstants.STATIC) {
    if (payload.fido2Configuration) {
      payload.fido2Configuration.authenticatorCertsFolder = data.authenticatorCertsFolder
      payload.fido2Configuration.mdsCertsFolder = data.mdsCertsFolder
      payload.fido2Configuration.mdsTocsFolder = data.mdsTocsFolder
      payload.fido2Configuration.unfinishedRequestExpiration = data.unfinishedRequestExpiration
      payload.fido2Configuration.authenticationHistoryExpiration =
        data.authenticationHistoryExpiration
      payload.fido2Configuration.serverMetadataFolder = data.serverMetadataFolder
      payload.fido2Configuration.userAutoEnrollment = data.userAutoEnrollment
      payload.fido2Configuration.enabledFidoAlgorithms = data.requestedCredentialTypes.map(
        (item: any) => (item?.value ? item?.value : item),
      )
      payload.fido2Configuration.rp = data.requestedParties.map((item: any) => {
        return {
          id: item.key,
          origins: [item.value],
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
    payload.metricReporterEnabled = data.metricReporterEnabled
    payload.metricReporterInterval = data.metricReporterInterval
    payload.metricReporterKeepDataDays = data.metricReporterKeepDataDays
    payload.personCustomObjectClassList = data.personCustomObjectClassList.map((item: any) =>
      item?.value ? item?.value : item,
    )

    if (payload.fido2Configuration) {
      payload.fido2Configuration.hints = data.hints || []
    }
  }

  const opts: Record<string, any> = {}
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
