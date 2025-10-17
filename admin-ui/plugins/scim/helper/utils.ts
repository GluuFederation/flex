import { AppConfiguration3, JsonPatch } from 'JansConfigApi'
import { ScimFormValues } from '../types'

/**
 * Converts boolean-like values to actual boolean type
 */
const toBooleanValue = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true'
  }
  return Boolean(value)
}

/**
 * Transforms API configuration to form-friendly values
 */
export const transformToFormValues = (config: AppConfiguration3 | undefined): ScimFormValues => {
  return {
    baseDN: config?.baseDN || '',
    applicationUrl: config?.applicationUrl || '',
    baseEndpoint: config?.baseEndpoint || '',
    personCustomObjectClass: config?.personCustomObjectClass || '',
    oxAuthIssuer: config?.oxAuthIssuer || '',
    protectionMode: config?.protectionMode || '',
    maxCount: config?.maxCount ?? '',
    bulkMaxOperations: config?.bulkMaxOperations ?? '',
    bulkMaxPayloadSize: config?.bulkMaxPayloadSize ?? '',
    userExtensionSchemaURI: config?.userExtensionSchemaURI || '',
    loggingLevel: config?.loggingLevel || '',
    loggingLayout: config?.loggingLayout || '',
    metricReporterInterval: config?.metricReporterInterval ?? '',
    metricReporterKeepDataDays: config?.metricReporterKeepDataDays ?? '',
    metricReporterEnabled: toBooleanValue(config?.metricReporterEnabled),
    disableJdkLogger: toBooleanValue(config?.disableJdkLogger),
    disableLoggerTimer: toBooleanValue(config?.disableLoggerTimer),
    useLocalCache: toBooleanValue(config?.useLocalCache),
    skipDefinedPasswordValidation: toBooleanValue(config?.skipDefinedPasswordValidation),
  }
}

/**
 * Creates JSON Patch array from form value differences
 */
export const createJsonPatchFromDifferences = (
  originalConfig: AppConfiguration3,
  formValues: ScimFormValues,
): JsonPatch[] => {
  const patches: JsonPatch[] = []

  // Helper to compare and create patch
  const addPatchIfDifferent = (path: string, originalValue: unknown, newValue: unknown): void => {
    // Handle empty string vs undefined/null comparison
    const normalizedOriginal = originalValue === '' ? undefined : originalValue
    const normalizedNew = newValue === '' ? undefined : newValue

    if (normalizedOriginal !== normalizedNew) {
      if (normalizedNew === undefined || normalizedNew === null) {
        // Don't send null/undefined values, just skip
        return
      }

      const operation = normalizedOriginal === undefined ? 'add' : 'replace'
      patches.push({
        op: operation,
        path: `/${path}`,
        value: newValue,
      })
    }
  }

  // Compare all fields
  addPatchIfDifferent('baseDN', originalConfig.baseDN, formValues.baseDN)
  addPatchIfDifferent('applicationUrl', originalConfig.applicationUrl, formValues.applicationUrl)
  addPatchIfDifferent('baseEndpoint', originalConfig.baseEndpoint, formValues.baseEndpoint)
  addPatchIfDifferent(
    'personCustomObjectClass',
    originalConfig.personCustomObjectClass,
    formValues.personCustomObjectClass,
  )
  addPatchIfDifferent('oxAuthIssuer', originalConfig.oxAuthIssuer, formValues.oxAuthIssuer)
  addPatchIfDifferent('protectionMode', originalConfig.protectionMode, formValues.protectionMode)
  addPatchIfDifferent(
    'maxCount',
    originalConfig.maxCount,
    formValues.maxCount !== '' ? Number(formValues.maxCount) : undefined,
  )
  addPatchIfDifferent(
    'bulkMaxOperations',
    originalConfig.bulkMaxOperations,
    formValues.bulkMaxOperations !== '' ? Number(formValues.bulkMaxOperations) : undefined,
  )
  addPatchIfDifferent(
    'bulkMaxPayloadSize',
    originalConfig.bulkMaxPayloadSize,
    formValues.bulkMaxPayloadSize !== '' ? Number(formValues.bulkMaxPayloadSize) : undefined,
  )
  addPatchIfDifferent(
    'userExtensionSchemaURI',
    originalConfig.userExtensionSchemaURI,
    formValues.userExtensionSchemaURI,
  )
  addPatchIfDifferent('loggingLevel', originalConfig.loggingLevel, formValues.loggingLevel)
  addPatchIfDifferent('loggingLayout', originalConfig.loggingLayout, formValues.loggingLayout)
  addPatchIfDifferent(
    'metricReporterInterval',
    originalConfig.metricReporterInterval,
    formValues.metricReporterInterval !== ''
      ? Number(formValues.metricReporterInterval)
      : undefined,
  )
  addPatchIfDifferent(
    'metricReporterKeepDataDays',
    originalConfig.metricReporterKeepDataDays,
    formValues.metricReporterKeepDataDays !== ''
      ? Number(formValues.metricReporterKeepDataDays)
      : undefined,
  )
  addPatchIfDifferent(
    'metricReporterEnabled',
    originalConfig.metricReporterEnabled,
    formValues.metricReporterEnabled,
  )
  addPatchIfDifferent(
    'disableJdkLogger',
    originalConfig.disableJdkLogger,
    formValues.disableJdkLogger,
  )
  addPatchIfDifferent(
    'disableLoggerTimer',
    originalConfig.disableLoggerTimer,
    formValues.disableLoggerTimer,
  )
  addPatchIfDifferent('useLocalCache', originalConfig.useLocalCache, formValues.useLocalCache)
  addPatchIfDifferent(
    'skipDefinedPasswordValidation',
    originalConfig.skipDefinedPasswordValidation,
    formValues.skipDefinedPasswordValidation,
  )

  return patches
}

export { toBooleanValue }
