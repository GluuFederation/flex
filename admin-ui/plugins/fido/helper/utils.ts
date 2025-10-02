import { PublicKeyCredentialHints } from '../types'
import { fidoConstants } from './constants'
import {
  AppConfiguration1,
  Fido2Configuration,
} from '../../../jans_config_api_orval/src/JansConfigApi'
import {
  DynamicConfigFormValues,
  StaticConfigFormValues,
  CreateFidoConfigPayloadParams,
  PutPropertiesFido2Params,
} from '../types/fido-types'

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

const transformToFormValues = (
  configuration: AppConfiguration1 | Fido2Configuration | undefined,
  type?: string,
): DynamicConfigFormValues | StaticConfigFormValues => {
  if (type === fidoConstants.STATIC) {
    const config = configuration as Fido2Configuration | undefined
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
  } else {
    const config = configuration as AppConfiguration1 | undefined
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
}

const createFidoConfigPayload = ({
  fidoConfiguration,
  data,
  type,
}: CreateFidoConfigPayloadParams): PutPropertiesFido2Params => {
  const payload: AppConfiguration1 = JSON.parse(JSON.stringify(fidoConfiguration))

  if (type === fidoConstants.STATIC) {
    const staticData = data as StaticConfigFormValues
    if (payload.fido2Configuration) {
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
  } else {
    const dynamicData = data as DynamicConfigFormValues
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

    if (payload.fido2Configuration) {
      payload.fido2Configuration.hints = dynamicData.hints || []
    }
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
