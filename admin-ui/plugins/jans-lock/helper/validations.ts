import * as Yup from 'yup'
import type { TFunction } from 'i18next'

const isValidUrl = (value: string | undefined): boolean => {
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

export const getLockValidationSchema = (t: TFunction) =>
  Yup.object({
    cleanServiceInterval: Yup.number()
      .nullable()
      .transform(emptyStringToNull)
      .integer(t('messages.lock_clean_service_interval_type'))
      .min(1, t('messages.lock_clean_service_interval_min'))
      .required(t('messages.lock_clean_service_interval_required'))
      .typeError(t('messages.lock_clean_service_interval_type')),
    metricReporterInterval: Yup.number()
      .nullable()
      .transform(emptyStringToNull)
      .integer(t('messages.lock_metric_interval_type'))
      .min(1, t('messages.lock_metric_interval_min'))
      .typeError(t('messages.lock_metric_interval_type')),
    metricReporterKeepDataDays: Yup.number()
      .nullable()
      .transform(emptyStringToNull)
      .integer(t('messages.lock_metric_keep_days_type'))
      .min(0, t('messages.lock_metric_keep_days_min'))
      .typeError(t('messages.lock_metric_keep_days_type')),
    policiesJsonUris: Yup.string().test(
      'valid-url',
      t('messages.lock_policy_url_invalid'),
      isValidUrl,
    ),
    policiesZipUris: Yup.string().test(
      'valid-url',
      t('messages.lock_policy_url_invalid'),
      isValidUrl,
    ),
  })
