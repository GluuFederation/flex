import * as Yup from 'yup'
import type { TFunction } from 'i18next'
import { PublicKeyCredentialHints, AttestationMode } from '../types'
import type { FidoValidationSchemas } from '../types'
import { fidoConstants } from './constants'

export const isLastKeyValueComplete = (items: Array<{ key?: string; value?: string }>): boolean => {
  if (items.length === 0) return true
  const last = items[items.length - 1]
  return Boolean((last.key ?? '').trim()) && Boolean((last.value ?? '').trim())
}

export const isLastStringEntryComplete = (items: string[]): boolean => {
  if (items.length === 0) return true
  const last = items[items.length - 1]
  return Boolean((last ?? '').trim())
}

export const isLastMetadataServerComplete = (
  items: Array<{ url?: string; rootCert?: string }>,
): boolean => {
  if (items.length === 0) return true
  const last = items[items.length - 1]
  return Boolean((last.url ?? '').trim()) && Boolean((last.rootCert ?? '').trim())
}

const EMPTY_ROW_KEY_VALUE_MSG = 'errors.fido_empty_row_key_value'
const EMPTY_ROW_VALUE_MSG = 'errors.fido_empty_row_value'
const EMPTY_ROW_METADATA_SERVER_MSG = 'errors.fido_empty_row_metadata_server'

const L = fidoConstants.LABELS

const getFidoValidationSchemas = (t: TFunction): FidoValidationSchemas => {
  const required = (label: string) => t('validation_messages.field_required', { field: t(label) })
  const numeric = (label: string) =>
    t('validation_messages.field_must_be_number', { field: t(label) })
  const invalid = (label: string) =>
    t('validation_messages.field_invalid_value', { field: t(label) })
  const minItems = (label: string) => t('validation_messages.field_min_items', { field: t(label) })

  const dynamicConfigValidationSchema = Yup.object({
    issuer: Yup.string().required(required(L.ISSUER)),
    baseEndpoint: Yup.string().required(required(L.BASE_ENDPOINT)),
    cleanServiceInterval: Yup.number()
      .typeError(numeric(L.CLEAN_SERVICE_INTERVAL))
      .required(required(L.CLEAN_SERVICE_INTERVAL)),
    cleanServiceBatchChunkSize: Yup.number()
      .typeError(numeric(L.CLEAN_SERVICE_BATCH_CHUNK))
      .required(required(L.CLEAN_SERVICE_BATCH_CHUNK)),
    useLocalCache: Yup.boolean().required(required(L.USE_LOCAL_CACHE)),
    disableJdkLogger: Yup.boolean().required(required(L.DISABLE_JDK_LOGGER)),
    loggingLevel: Yup.string().required(required(L.LOGGING_LEVEL)),
    loggingLayout: Yup.string().required(required(L.LOGGING_LAYOUT)),
    metricReporterEnabled: Yup.boolean().required(required(L.METRIC_REPORTER_ENABLED)),
    metricReporterInterval: Yup.number()
      .typeError(numeric(L.METRIC_REPORTER_INTERVAL))
      .required(required(L.METRIC_REPORTER_INTERVAL)),
    metricReporterKeepDataDays: Yup.number()
      .typeError(numeric(L.METRIC_REPORTER_KEEP_DATA_DAYS))
      .required(required(L.METRIC_REPORTER_KEEP_DATA_DAYS)),
    personCustomObjectClassList: Yup.array()
      .of(Yup.string())
      .test('no-empty-entries', t(EMPTY_ROW_VALUE_MSG), (items) => {
        if (!items || items.length === 0) return true
        return items.every((item) => Boolean((item ?? '').trim()))
      }),
    fido2MetricsEnabled: Yup.boolean().required(required(L.FIDO2_METRICS_ENABLED)),
    fido2MetricsRetentionDays: Yup.number()
      .typeError(numeric(L.FIDO2_METRICS_RETENTION_DAYS))
      .required(required(L.FIDO2_METRICS_RETENTION_DAYS)),
    fido2DeviceInfoCollection: Yup.boolean().required(required(L.FIDO2_DEVICE_INFO_COLLECTION)),
    fido2ErrorCategorization: Yup.boolean().required(required(L.FIDO2_ERROR_CATEGORIZATION)),
    fido2PerformanceMetrics: Yup.boolean().required(required(L.FIDO2_PERFORMANCE_METRICS)),
  })

  const staticConfigValidationSchema = Yup.object({
    authenticatorCertsFolder: Yup.string().required(required(L.AUTHENTICATOR_CERTIFICATES_FOLDER)),
    mdsCertsFolder: Yup.string().required(required(L.MDS_TOC_CERTIFICATES_FOLDER)),
    mdsTocsFolder: Yup.string().required(required(L.MDS_TOC_FILES_FOLDER)),
    unfinishedRequestExpiration: Yup.number()
      .typeError(numeric(L.UNFINISHED_REQUEST_EXPIRATION))
      .required(required(L.UNFINISHED_REQUEST_EXPIRATION)),
    authenticationHistoryExpiration: Yup.number()
      .typeError(numeric(L.AUTHENTICATION_HISTORY_EXPIRATION))
      .required(required(L.AUTHENTICATION_HISTORY_EXPIRATION)),
    serverMetadataFolder: Yup.string().required(required(L.SERVER_METADATA_FOLDER)),
    userAutoEnrollment: Yup.boolean().required(required(L.USER_AUTO_ENROLLMENT)),
    requestedParties: Yup.array()
      .of(
        Yup.object().shape({
          key: Yup.string().nullable(),
          value: Yup.string().nullable(),
        }),
      )
      .test('no-empty-parties', t(EMPTY_ROW_KEY_VALUE_MSG), (items) => {
        if (!items || items.length === 0) return true
        return items.every(
          (item) => Boolean((item?.key ?? '').trim()) && Boolean((item?.value ?? '').trim()),
        )
      }),
    enabledFidoAlgorithms: Yup.array()
      .of(Yup.string())
      .test('no-empty-algorithms', t(EMPTY_ROW_VALUE_MSG), (items) => {
        if (!items || items.length === 0) return true
        return items.every((item) => Boolean((item ?? '').trim()))
      }),
    metadataServers: Yup.array()
      .of(
        Yup.object().shape({
          url: Yup.string().nullable(),
          rootCert: Yup.string().nullable(),
        }),
      )
      .test('no-empty-servers', t(EMPTY_ROW_METADATA_SERVER_MSG), (items) => {
        if (!items || items.length === 0) return true
        return items.every(
          (item) => Boolean((item?.url ?? '').trim()) && Boolean((item?.rootCert ?? '').trim()),
        )
      }),
    disableMetadataService: Yup.boolean().required(required(L.DISABLE_METADATA_SERVICE)),
    hints: Yup.array()
      .of(Yup.string().oneOf(Object.values(PublicKeyCredentialHints), invalid(L.HINTS)))
      .min(1, minItems(L.HINTS))
      .required(required(L.HINTS)),
    enterpriseAttestation: Yup.boolean().required(required(L.ENTERPRISE_ATTESTATION)),
    attestationMode: Yup.string()
      .oneOf(Object.values(AttestationMode), invalid(L.ATTESTATION_MODE))
      .required(required(L.ATTESTATION_MODE)),
  })

  return { dynamicConfigValidationSchema, staticConfigValidationSchema }
}

export { getFidoValidationSchemas }
