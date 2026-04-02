import * as Yup from 'yup'
import { PublicKeyCredentialHints, AttestationMode } from '../types'

export const isEveryKeyValueComplete = (
  items: Array<{ key?: string; value?: string }>,
): boolean => {
  if (items.length === 0) return true
  return items.every(
    (item) => Boolean((item.key ?? '').trim()) && Boolean((item.value ?? '').trim()),
  )
}

export const isLastKeyValueComplete = (items: Array<{ key?: string; value?: string }>): boolean => {
  if (items.length === 0) return true
  const last = items[items.length - 1]
  return Boolean((last.key ?? '').trim()) && Boolean((last.value ?? '').trim())
}

export const isEveryStringEntryComplete = (items: string[]): boolean => {
  if (items.length === 0) return true
  return items.every((item) => Boolean((item ?? '').trim()))
}

export const isLastStringEntryComplete = (items: string[]): boolean => {
  if (items.length === 0) return true
  const last = items[items.length - 1]
  return Boolean((last ?? '').trim())
}

export const isEveryMetadataServerComplete = (
  items: Array<{ url?: string; rootCert?: string }>,
): boolean => {
  if (items.length === 0) return true
  return items.every(
    (item) => Boolean((item.url ?? '').trim()) && Boolean((item.rootCert ?? '').trim()),
  )
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

const dynamicConfigValidationSchema = Yup.object({
  issuer: Yup.string().required('Issuer is required.'),
  baseEndpoint: Yup.string().required('Base Endpoint is required.'),
  cleanServiceInterval: Yup.number()
    .typeError('Clean Service Interval must be a number.')
    .required('Clean Service Interval is required.'),
  cleanServiceBatchChunkSize: Yup.number()
    .typeError('Clean Service Batch Chunk Size must be a number.')
    .required('Clean Service Batch Chunk Size is required.'),
  useLocalCache: Yup.boolean().required('Use Local Cache is required.'),
  disableJdkLogger: Yup.boolean().required('Disable JDK Logger is required.'),
  loggingLevel: Yup.string().required('Logging Level is required.'),
  loggingLayout: Yup.string().required('Logging Layout is required.'),
  metricReporterEnabled: Yup.boolean().required('Metric Reporter Enabled is required.'),
  metricReporterInterval: Yup.number()
    .typeError('Metric Reporter Interval must be a number.')
    .required('Metric Reporter Interval is required.'),
  metricReporterKeepDataDays: Yup.number()
    .typeError('Metric Reporter Keep Data Days must be a number.')
    .required('Metric Reporter Keep Data Days is required.'),
  personCustomObjectClassList: Yup.array()
    .of(Yup.string())
    .test('no-empty-entries', EMPTY_ROW_VALUE_MSG, (items) => {
      if (!items || items.length === 0) return true
      return items.every((item) => Boolean((item ?? '').trim()))
    }),
  fido2MetricsEnabled: Yup.boolean().required('FIDO2 Metrics Enabled is required.'),
  fido2MetricsRetentionDays: Yup.number()
    .typeError('FIDO2 Metrics Retention Days must be a number.')
    .required('FIDO2 Metrics Retention Days is required.'),
  fido2DeviceInfoCollection: Yup.boolean().required('FIDO2 Device Info Collection is required.'),
  fido2ErrorCategorization: Yup.boolean().required('FIDO2 Error Categorization is required.'),
  fido2PerformanceMetrics: Yup.boolean().required('FIDO2 Performance Metrics is required.'),
})

const staticConfigValidationSchema = Yup.object({
  authenticatorCertsFolder: Yup.string().required('Authenticator Certificates Folder is required.'),
  mdsCertsFolder: Yup.string().required('MDS TOC Certificates Folder is required.'),
  mdsTocsFolder: Yup.string().required('MDS TOC Files Folder is required.'),
  unfinishedRequestExpiration: Yup.number()
    .typeError('Unfinished Request Expiration must be a number.')
    .required('Unfinished Request Expiration is required.'),
  authenticationHistoryExpiration: Yup.number()
    .typeError('Authentication History Expiration must be a number.')
    .required('Authentication History Expiration is required.'),
  serverMetadataFolder: Yup.string().required('Server Metadata is required.'),
  userAutoEnrollment: Yup.boolean().required('User Auto Enrollment is required.'),
  requestedParties: Yup.array()
    .of(
      Yup.object().shape({
        key: Yup.string().nullable(),
        value: Yup.string().nullable(),
      }),
    )
    .test('no-empty-parties', EMPTY_ROW_KEY_VALUE_MSG, (items) => {
      if (!items || items.length === 0) return true
      return items.every(
        (item) => Boolean((item?.key ?? '').trim()) && Boolean((item?.value ?? '').trim()),
      )
    }),
  enabledFidoAlgorithms: Yup.array()
    .of(Yup.string())
    .test('no-empty-algorithms', EMPTY_ROW_VALUE_MSG, (items) => {
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
    .test('no-empty-servers', EMPTY_ROW_METADATA_SERVER_MSG, (items) => {
      if (!items || items.length === 0) return true
      return items.every(
        (item) => Boolean((item?.url ?? '').trim()) && Boolean((item?.rootCert ?? '').trim()),
      )
    }),
  disableMetadataService: Yup.boolean().required('Disable Metadata Service is required.'),
  hints: Yup.array()
    .of(Yup.string().oneOf(Object.values(PublicKeyCredentialHints), 'Invalid hint value.'))
    .min(1, 'At least one hint is required.')
    .required('Hints are required.'),
  enterpriseAttestation: Yup.boolean().required('Enterprise Attestation is required.'),
  attestationMode: Yup.string()
    .oneOf(Object.values(AttestationMode), 'Invalid attestation mode.')
    .required('Attestation Mode is required.'),
})

export const validationSchema: {
  dynamicConfigValidationSchema: typeof dynamicConfigValidationSchema
  staticConfigValidationSchema: typeof staticConfigValidationSchema
} = {
  dynamicConfigValidationSchema,
  staticConfigValidationSchema,
}
