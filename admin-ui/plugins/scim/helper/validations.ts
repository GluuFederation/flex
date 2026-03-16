import * as Yup from 'yup'
import type { TFunction } from 'i18next'
import { PROTECTION_MODES } from './constants'

const isSecureUrl = (value: string | undefined): boolean => {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const emptyStringToNull = (value: number | null, original: string | number) =>
  original === '' ? null : value

export const getScimConfigurationSchema = (t: TFunction) =>
  Yup.object({
    baseDN: Yup.string(),
    applicationUrl: Yup.string().test(
      'valid-secure-url',
      t('messages.scim_application_url_invalid'),
      isSecureUrl,
    ),
    baseEndpoint: Yup.string(),
    personCustomObjectClass: Yup.string(),
    oxAuthIssuer: Yup.string(),
    protectionMode: Yup.string().oneOf(
      [...PROTECTION_MODES, ''],
      t('messages.scim_protection_mode_invalid'),
    ),
    maxCount: Yup.number()
      .nullable()
      .transform(emptyStringToNull)
      .typeError(t('messages.scim_max_count_type'))
      .positive(t('messages.scim_max_count_positive'))
      .integer(t('messages.scim_max_count_integer'))
      .max(2147483647, t('messages.scim_max_count_max')),
    bulkMaxOperations: Yup.number()
      .nullable()
      .transform(emptyStringToNull)
      .typeError(t('messages.scim_bulk_max_operations_type'))
      .positive(t('messages.scim_bulk_max_operations_positive'))
      .integer(t('messages.scim_bulk_max_operations_integer'))
      .max(100000, t('messages.scim_bulk_max_operations_max')),
    bulkMaxPayloadSize: Yup.number()
      .nullable()
      .transform(emptyStringToNull)
      .typeError(t('messages.scim_bulk_max_payload_type'))
      .positive(t('messages.scim_bulk_max_payload_positive'))
      .integer(t('messages.scim_bulk_max_payload_integer'))
      .max(104857600, t('messages.scim_bulk_max_payload_max')),
    userExtensionSchemaURI: Yup.string(),
    loggingLevel: Yup.string(),
    loggingLayout: Yup.string(),
    metricReporterInterval: Yup.number()
      .nullable()
      .transform(emptyStringToNull)
      .typeError(t('messages.scim_metric_interval_type'))
      .positive(t('messages.scim_metric_interval_positive'))
      .integer(t('messages.scim_metric_interval_integer'))
      .max(86400, t('messages.scim_metric_interval_max')),
    metricReporterKeepDataDays: Yup.number()
      .nullable()
      .transform(emptyStringToNull)
      .typeError(t('messages.scim_metric_keep_days_type'))
      .positive(t('messages.scim_metric_keep_days_positive'))
      .integer(t('messages.scim_metric_keep_days_integer'))
      .max(3650, t('messages.scim_metric_keep_days_max')),
    metricReporterEnabled: Yup.boolean(),
    disableJdkLogger: Yup.boolean(),
    disableLoggerTimer: Yup.boolean(),
    useLocalCache: Yup.boolean(),
    skipDefinedPasswordValidation: Yup.boolean(),
  })
