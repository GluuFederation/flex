import { PublicKeyCredentialHints } from '../types'
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

const transformToFormValues = (configuration?: any, type?: string) => {
  return type === fidoConstants.STATIC
    ? {
        authenticatorCertsFolder: configuration?.authenticatorCertsFolder || '',
        mdsAccessToken: configuration?.mdsAccessToken || '',
        mdsCertsFolder: configuration?.mdsCertsFolder || '',
        mdsTocsFolder: configuration?.mdsTocsFolder || '',
        checkU2fAttestations: configuration?.checkU2fAttestations || false,
        unfinishedRequestExpiration: configuration?.unfinishedRequestExpiration || '',
        authenticationHistoryExpiration: configuration?.authenticationHistoryExpiration || '',
        serverMetadataFolder: configuration?.serverMetadataFolder || '',
        userAutoEnrollment: configuration?.userAutoEnrollment,
        requestedCredentialTypes: configuration?.requestedCredentialTypes || [],
        requestedParties: configuration?.requestedParties || [],
      }
    : {
        issuer: configuration?.issuer || '',
        baseEndpoint: configuration?.baseEndpoint || '',
        cleanServiceInterval: configuration?.cleanServiceInterval || '',
        cleanServiceBatchChunkSize: configuration?.cleanServiceBatchChunkSize || '',
        useLocalCache: configuration?.useLocalCache || '',
        disableJdkLogger: configuration?.disableJdkLogger || '',
        loggingLevel: configuration?.loggingLevel || '',
        loggingLayout: configuration?.loggingLayout || '',
        externalLoggerConfiguration: configuration?.externalLoggerConfiguration || '',
        metricReporterEnabled: configuration?.metricReporterEnabled,
        metricReporterInterval: configuration?.metricReporterInterval || '',
        metricReporterKeepDataDays: configuration?.metricReporterKeepDataDays || '',
        personCustomObjectClassList: configuration?.personCustomObjectClassList || [],
        hints: arrayValidationWithSchema(
          configuration?.fido2Configuration?.hints,
          PublicKeyCredentialHints,
        ),
      }
}

const createFidoConfigPayload = ({ fidoConfiguration, data, type }: any) => {
  const payload = JSON.parse(JSON.stringify(fidoConfiguration.fido))
  if (type === fidoConstants.STATIC) {
    if (payload.fido2Configuration) {
      payload.fido2Configuration.authenticatorCertsFolder = data.authenticatorCertsFolder
      payload.fido2Configuration.mdsAccessToken = data.mdsAccessToken
      payload.fido2Configuration.mdsCertsFolder = data.mdsCertsFolder
      payload.fido2Configuration.mdsTocsFolder = data.mdsTocsFolder
      payload.fido2Configuration.checkU2fAttestations = data.checkU2fAttestations
      payload.fido2Configuration.unfinishedRequestExpiration = data.unfinishedRequestExpiration
      payload.fido2Configuration.authenticationHistoryExpiration =
        data.authenticationHistoryExpiration
      payload.fido2Configuration.serverMetadataFolder = data.serverMetadataFolder
      payload.fido2Configuration.userAutoEnrollment = data.userAutoEnrollment
      payload.fido2Configuration.requestedCredentialTypes = data.requestedCredentialTypes.map(
        (item: any) => (item?.value ? item?.value : item),
      )
      payload.fido2Configuration.requestedParties = data.requestedParties.map((item: any) => {
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
}
