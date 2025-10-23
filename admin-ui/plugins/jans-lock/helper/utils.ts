import { jansLockConstants } from './constants'
import { JansLockConfigFormValues, PatchOperation } from '../types'

export const toBooleanValue = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    return value.toLowerCase() === jansLockConstants.BINARY_VALUES.TRUE
  }
  return Boolean(value)
}

export const toNumberValue = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  return Number(value)
}

export const transformToFormValues = (
  config: Record<string, unknown> = {},
): JansLockConfigFormValues => {
  return {
    tokenChannels: (config.tokenChannels as string[]) || [],
    disableJdkLogger: toBooleanValue(config.disableJdkLogger),
    loggingLevel: (config.loggingLevel as string) || '',
    loggingLayout: (config.loggingLayout as string) || '',
    externalLoggerConfiguration: (config.externalLoggerConfiguration as string) || '',
    metricReporterEnabled: toBooleanValue(config.metricReporterEnabled),
    metricReporterInterval:
      config.metricReporterInterval !== undefined && config.metricReporterInterval !== null
        ? (config.metricReporterInterval as number)
        : '',
    metricReporterKeepDataDays:
      config.metricReporterKeepDataDays !== undefined && config.metricReporterKeepDataDays !== null
        ? (config.metricReporterKeepDataDays as number)
        : '',
    cleanServiceInterval:
      config.cleanServiceInterval !== undefined && config.cleanServiceInterval !== null
        ? (config.cleanServiceInterval as number)
        : '',
    cleanServiceBatchChunkSize:
      config.cleanServiceBatchChunkSize !== undefined && config.cleanServiceBatchChunkSize !== null
        ? (config.cleanServiceBatchChunkSize as number)
        : '',
    baseDN: (config.baseDN as string) || '',
    baseEndpoint: (config.baseEndpoint as string) || '',
    clientId: (config.clientId as string) || '',
    endpointDetails: (config.endpointDetails as Record<string, unknown>) || {},
    endpointGroups: (config.endpointGroups as Record<string, unknown>) || {},
    errorReasonEnabled: toBooleanValue(config.errorReasonEnabled),
    messageConsumerType: (config.messageConsumerType as string) || '',
    openIdIssuer: (config.openIdIssuer as string) || '',
    statEnabled: toBooleanValue(config.statEnabled),
    statTimerIntervalInSeconds:
      config.statTimerIntervalInSeconds !== undefined && config.statTimerIntervalInSeconds !== null
        ? (config.statTimerIntervalInSeconds as number)
        : '',
    tokenUrl: (config.tokenUrl as string) || '',
  }
}

export const createPatchOperations = (
  formValues: JansLockConfigFormValues,
  originalConfig: Record<string, unknown>,
): PatchOperation[] => {
  const differences: PatchOperation[] = []
  const normalizedValues: Record<string, unknown> = { ...formValues }
  const booleanFields = [
    'metricReporterEnabled',
    'disableJdkLogger',
    'errorReasonEnabled',
    'statEnabled',
  ]
  booleanFields.forEach((field) => {
    if (field in normalizedValues) {
      normalizedValues[field] = String(normalizedValues[field]) === 'true'
    }
  })

  const numericFields = [
    'metricReporterInterval',
    'metricReporterKeepDataDays',
    'cleanServiceInterval',
    'cleanServiceBatchChunkSize',
    'statTimerIntervalInSeconds',
  ]
  numericFields.forEach((field) => {
    if (normalizedValues[field] !== undefined && normalizedValues[field] !== '') {
      normalizedValues[field] = Number(normalizedValues[field])
    } else {
      normalizedValues[field] = undefined
    }
  })

  for (const key in normalizedValues) {
    if (Object.prototype.hasOwnProperty.call(originalConfig, key)) {
      if (JSON.stringify(originalConfig[key]) !== JSON.stringify(normalizedValues[key])) {
        if (normalizedValues[key] !== undefined) {
          differences.push({
            op: 'replace',
            path: `/${key}`,
            value: normalizedValues[key],
          })
        }
      }
    } else if (normalizedValues[key] !== undefined && normalizedValues[key] !== '') {
      differences.push({
        op: 'add',
        path: `/${key}`,
        value: normalizedValues[key],
      })
    }
  }

  return differences
}
