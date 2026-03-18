import type { TFunction } from 'i18next'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/GluuCommitDialog'
import { jansLockConstants } from './constants'
import { JansLockConfigFormValues, PatchOperation } from '../types'

export const toBooleanValue = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    return value.toLowerCase() === jansLockConstants.BINARY_VALUES.TRUE
  }
  return Boolean(value)
}

type CedarlingConfig = {
  policySources?: Array<{
    authorizationToken?: string
    policyStoreUri?: string
  }>
}

const getPolicySource = (config: Record<string, unknown>, index: number) => {
  const cedarling = config.cedarlingConfiguration as CedarlingConfig | undefined
  return cedarling?.policySources?.[index]
}

export const transformToFormValues = (
  config: Record<string, unknown> = {},
): JansLockConfigFormValues => {
  const jsonPolicySource = getPolicySource(config, 0)
  const zipPolicySource = getPolicySource(config, 1)

  return {
    baseDN: (config.baseDN as string) || '',
    tokenChannels: Array.isArray(config.tokenChannels)
      ? (config.tokenChannels as string[]).join(', ')
      : (config.tokenChannels as string) || '',
    disableJdkLogger: toBooleanValue(config.disableJdkLogger),
    loggingLevel: (config.loggingLevel as string) || '',
    loggingLayout: (config.loggingLayout as string) || '',
    externalLoggerConfiguration: (config.externalLoggerConfiguration as string) || '',
    disableExternalLoggerConfiguration: toBooleanValue(config.disableExternalLoggerConfiguration),
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
    metricChannel: (config.metricChannel as string) || '',
    policiesJsonUrisAuthorizationToken: jsonPolicySource?.authorizationToken || '',
    policiesJsonUris: jsonPolicySource?.policyStoreUri || '',
    policiesZipUrisAuthorizationToken: zipPolicySource?.authorizationToken || '',
    policiesZipUris: zipPolicySource?.policyStoreUri || '',
  }
}

export const createPatchOperations = (
  formValues: JansLockConfigFormValues,
  originalConfig: Record<string, unknown>,
): PatchOperation[] => {
  const differences: PatchOperation[] = []

  const {
    policiesJsonUrisAuthorizationToken,
    policiesJsonUris,
    policiesZipUrisAuthorizationToken,
    policiesZipUris,
    ...flatValues
  } = formValues

  const normalizedValues: Record<string, unknown> = { ...flatValues }

  if (typeof normalizedValues.tokenChannels === 'string') {
    const channels = (normalizedValues.tokenChannels as string)
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
    normalizedValues.tokenChannels = channels.length > 0 ? channels : undefined
  }

  const booleanFields = [
    'metricReporterEnabled',
    'disableJdkLogger',
    'disableExternalLoggerConfiguration',
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
    } else if (
      normalizedValues[key] !== undefined &&
      normalizedValues[key] !== '' &&
      normalizedValues[key] !== false
    ) {
      const value = normalizedValues[key]
      const isEmptyArray = Array.isArray(value) && value.length === 0
      const isEmptyObject =
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.keys(value as Record<string, unknown>).length === 0

      if (!isEmptyArray && !isEmptyObject) {
        differences.push({
          op: 'add',
          path: `/${key}`,
          value: normalizedValues[key],
        })
      }
    }
  }

  // Handle nested cedarling policy sources
  const cedarling = originalConfig.cedarlingConfiguration as CedarlingConfig | undefined
  const originalJsonSource = cedarling?.policySources?.[0]
  const originalZipSource = cedarling?.policySources?.[1]

  const jsonSourceChanged =
    (policiesJsonUrisAuthorizationToken || '') !== (originalJsonSource?.authorizationToken || '') ||
    (policiesJsonUris || '') !== (originalJsonSource?.policyStoreUri || '')

  const zipSourceChanged =
    (policiesZipUrisAuthorizationToken || '') !== (originalZipSource?.authorizationToken || '') ||
    (policiesZipUris || '') !== (originalZipSource?.policyStoreUri || '')

  if (jsonSourceChanged || zipSourceChanged) {
    const policySources = [
      policiesJsonUris || policiesJsonUrisAuthorizationToken
        ? {
            authorizationToken: policiesJsonUrisAuthorizationToken || '',
            policyStoreUri: policiesJsonUris || '',
          }
        : null,
      policiesZipUris || policiesZipUrisAuthorizationToken
        ? {
            authorizationToken: policiesZipUrisAuthorizationToken || '',
            policyStoreUri: policiesZipUris || '',
          }
        : null,
    ].filter((e): e is { authorizationToken: string; policyStoreUri: string } => e !== null)

    const updatedCedarling = {
      ...(cedarling || {}),
      policySources,
    }

    differences.push({
      op: cedarling ? 'replace' : 'add',
      path: '/cedarlingConfiguration',
      value: updatedCedarling,
    })
  }

  return differences
}

const LOCK_FIELD_LABELS: Array<{ key: keyof JansLockConfigFormValues; label: string }> = [
  { key: 'baseDN', label: 'fields.base_dn' },
  { key: 'tokenChannels', label: 'fields.token_channels' },
  { key: 'loggingLevel', label: 'fields.logging_level' },
  { key: 'loggingLayout', label: 'fields.logging_layout' },
  { key: 'externalLoggerConfiguration', label: 'fields.external_logger_configuration' },
  {
    key: 'disableExternalLoggerConfiguration',
    label: 'fields.disable_external_logger_configuration',
  },
  { key: 'metricReporterEnabled', label: 'fields.metric_reporter_enabled' },
  { key: 'metricReporterInterval', label: 'fields.metric_reporter_interval' },
  { key: 'metricReporterKeepDataDays', label: 'fields.metric_reporter_keep_data_days' },
  { key: 'cleanServiceInterval', label: 'fields.clean_service_interval' },
  { key: 'metricChannel', label: 'fields.metric_channel' },
  { key: 'disableJdkLogger', label: 'fields.disable_jdk_logger' },
  {
    key: 'policiesJsonUrisAuthorizationToken',
    label: 'fields.policies_json_uris_authorization_token',
  },
  { key: 'policiesJsonUris', label: 'fields.policies_json_uris' },
  {
    key: 'policiesZipUrisAuthorizationToken',
    label: 'fields.policies_zip_uris_authorization_token',
  },
  { key: 'policiesZipUris', label: 'fields.policies_zip_uris' },
]

export const buildLockChangedFieldOperations = (
  initial: JansLockConfigFormValues,
  current: JansLockConfigFormValues,
  t: TFunction,
): GluuCommitDialogOperation[] => {
  const operations: GluuCommitDialogOperation[] = []

  for (const { key, label } of LOCK_FIELD_LABELS) {
    const oldVal = initial[key]
    const newVal = current[key]
    if (String(oldVal ?? '') !== String(newVal ?? '')) {
      operations.push({ path: t(label), value: (newVal as JsonValue) ?? null })
    }
  }

  return operations
}
