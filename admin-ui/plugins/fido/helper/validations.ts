import * as Yup from 'yup'
import { PublicKeyCredentialHints } from '../types'

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
  externalLoggerConfiguration: Yup.string(),
  metricReporterEnabled: Yup.boolean().required('Metric Reporter Enabled is required.'),
  metricReporterInterval: Yup.number()
    .typeError('Metric Reporter Interval must be a number.')
    .required('Metric Reporter Interval is required.'),
  metricReporterKeepDataDays: Yup.number()
    .typeError('Metric Reporter Keep Data Days must be a number.')
    .required('Metric Reporter Keep Data Days is required.'),
  personCustomObjectClassList: Yup.array().of(Yup.string()),
  fido2MetricsEnabled: Yup.boolean().required('FIDO2 Metrics Enabled is required.'),
  fido2MetricsRetentionDays: Yup.number()
    .typeError('FIDO2 Metrics Retention Days must be a number.')
    .required('FIDO2 Metrics Retention Days is required.'),
  fido2DeviceInfoCollection: Yup.boolean().required('FIDO2 Device Info Collection is required.'),
  fido2ErrorCategorization: Yup.boolean().required('FIDO2 Error Categorization is required.'),
  fido2PerformanceMetrics: Yup.boolean().required('FIDO2 Performance Metrics is required.'),
  sessionIdPersistInCache: Yup.boolean().required('Session ID Persist In Cache is required.'),
  errorReasonEnabled: Yup.boolean().required('Error Reason Enabled is required.'),
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
  metadataRefreshInterval: Yup.number()
    .typeError('Metadata Refresh Interval must be a number.')
    .required('Metadata Refresh Interval is required.'),
  enabledFidoAlgorithms: Yup.array().of(Yup.string()),
  metadataServers: Yup.array().of(
    Yup.object({
      url: Yup.string().required('Metadata Server URL is required.'),
      rootCert: Yup.string().required('Root Certificate is required.'),
    }),
  ),
  disableMetadataService: Yup.boolean().required('Disable Metadata Service is required.'),
  hints: Yup.array()
    .of(Yup.string().oneOf(Object.values(PublicKeyCredentialHints), 'Invalid hint value.'))
    .min(1, 'At least one hint is required.')
    .required('Hints are required.'),
  enterpriseAttestation: Yup.boolean().required('Enterprise Attestation is required.'),
  attestationMode: Yup.string().required('Attestation Mode is required.'),
})

export const validationSchema: Record<
  string,
  typeof dynamicConfigValidationSchema | typeof staticConfigValidationSchema
> = {
  dynamicConfigValidationSchema,
  staticConfigValidationSchema,
}
