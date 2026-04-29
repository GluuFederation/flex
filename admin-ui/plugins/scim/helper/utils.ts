import { AppConfiguration3, JsonPatch } from 'JansConfigApi'
import type { TFunction } from 'i18next'
import type { JsonValue, GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/index'
import { triggerWebhookForFeature } from '@/utils/triggerWebhookForFeature'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { ScimFormValues } from '../types'
import { SCIM_FIELD_CONFIGS } from '../components/constants'

const toBooleanValue = (value: JsonValue | undefined): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true'
  }
  return Boolean(value)
}

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
    externalLoggerConfiguration: config?.externalLoggerConfiguration || '',
    disableExternalLoggerConfiguration: toBooleanValue(config?.disableExternalLoggerConfiguration),
    metricReporterInterval: config?.metricReporterInterval ?? '',
    metricReporterKeepDataDays: config?.metricReporterKeepDataDays ?? '',
    metricReporterEnabled: toBooleanValue(config?.metricReporterEnabled),
    disableJdkLogger: toBooleanValue(config?.disableJdkLogger),
    disableLoggerTimer: toBooleanValue(config?.disableLoggerTimer),
    useLocalCache: toBooleanValue(config?.useLocalCache),
    skipDefinedPasswordValidation: toBooleanValue(config?.skipDefinedPasswordValidation),
  }
}

export const createJsonPatchFromDifferences = (
  originalConfig: AppConfiguration3,
  formValues: ScimFormValues,
): JsonPatch[] => {
  const patches: JsonPatch[] = []

  const addPatchIfDifferent = (
    path: string,
    originalValue: JsonValue | undefined,
    newValue: JsonValue | undefined,
  ): void => {
    const normalizedOriginal = originalValue === '' ? undefined : originalValue
    const normalizedNew = newValue === '' ? undefined : newValue

    if (normalizedOriginal !== normalizedNew) {
      if (normalizedNew === undefined || normalizedNew === null) {
        if (normalizedOriginal !== undefined && normalizedOriginal !== null) {
          patches.push({ op: 'remove', path: `/${path}` })
        }
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
    'externalLoggerConfiguration',
    originalConfig.externalLoggerConfiguration,
    formValues.externalLoggerConfiguration,
  )
  addPatchIfDifferent(
    'disableExternalLoggerConfiguration',
    originalConfig.disableExternalLoggerConfiguration,
    formValues.disableExternalLoggerConfiguration,
  )
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

export const buildScimChangedFieldOperations = (
  initial: ScimFormValues,
  current: ScimFormValues,
  t: TFunction,
): GluuCommitDialogOperation[] => {
  const operations: GluuCommitDialogOperation[] = []

  for (const { name, label, disabled } of SCIM_FIELD_CONFIGS) {
    if (disabled) continue
    const oldVal = initial[name]
    const newVal = current[name]
    if (String(oldVal ?? '') !== String(newVal ?? '')) {
      operations.push({ path: t(label), value: (newVal as JsonValue) ?? null })
    }
  }

  return operations
}

export const triggerScimWebhook = (
  data: AppConfiguration3,
  feature: string = adminUiFeatures.scim_configuration_edit,
): void => {
  triggerWebhookForFeature(data as Record<string, JsonValue>, feature)
}

export { toBooleanValue }
