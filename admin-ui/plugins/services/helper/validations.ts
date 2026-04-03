import * as Yup from 'yup'
import type { TFunction } from 'i18next'

export const getCacheValidationSchema = (t: TFunction) =>
  Yup.object({
    memoryDefaultPutExpiration: Yup.number()
      .nullable()
      .integer(t('messages.value_must_be_integer'))
      .min(0, t('messages.value_must_be_positive'))
      .typeError(t('messages.value_must_be_integer')),
    memDefaultPutExpiration: Yup.number()
      .nullable()
      .integer(t('messages.value_must_be_integer'))
      .min(0, t('messages.value_must_be_positive'))
      .typeError(t('messages.value_must_be_integer')),
    redisDefaultPutExpiration: Yup.number()
      .nullable()
      .integer(t('messages.value_must_be_integer'))
      .min(0, t('messages.value_must_be_positive'))
      .typeError(t('messages.value_must_be_integer')),
    nativeDefaultPutExpiration: Yup.number()
      .nullable()
      .integer(t('messages.value_must_be_integer'))
      .min(0, t('messages.value_must_be_positive'))
      .typeError(t('messages.value_must_be_integer')),
    defaultCleanupBatchSize: Yup.number()
      .nullable()
      .integer(t('messages.value_must_be_integer'))
      .min(0, t('messages.value_must_be_positive'))
      .typeError(t('messages.value_must_be_integer')),
    maxOperationQueueLength: Yup.number()
      .nullable()
      .integer(t('messages.value_must_be_integer'))
      .min(0, t('messages.value_must_be_positive'))
      .typeError(t('messages.value_must_be_integer')),
    bufferSize: Yup.number()
      .nullable()
      .integer(t('messages.value_must_be_integer'))
      .min(0, t('messages.value_must_be_positive'))
      .typeError(t('messages.value_must_be_integer')),
    maxIdleConnections: Yup.number()
      .nullable()
      .integer(t('messages.value_must_be_integer'))
      .min(0, t('messages.value_must_be_positive'))
      .typeError(t('messages.value_must_be_integer')),
    maxTotalConnections: Yup.number()
      .nullable()
      .integer(t('messages.value_must_be_integer'))
      .min(0, t('messages.value_must_be_positive'))
      .typeError(t('messages.value_must_be_integer')),
    connectionTimeout: Yup.number()
      .nullable()
      .integer(t('messages.value_must_be_integer'))
      .min(0, t('messages.value_must_be_positive'))
      .typeError(t('messages.value_must_be_integer')),
    soTimeout: Yup.number()
      .nullable()
      .integer(t('messages.value_must_be_integer'))
      .min(0, t('messages.value_must_be_positive'))
      .typeError(t('messages.value_must_be_integer')),
    maxRetryAttempts: Yup.number()
      .nullable()
      .integer(t('messages.value_must_be_integer'))
      .min(0, t('messages.value_must_be_positive'))
      .typeError(t('messages.value_must_be_integer')),
  })
