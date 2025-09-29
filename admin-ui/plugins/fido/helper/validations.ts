import * as Yup from 'yup'
import { PublicKeyCredentialHints } from '../types'

const dynamicConfigValidationSchema = Yup.object({
  issuer: Yup.string().required('Issuer is required.'),
  baseEndpoint: Yup.string().required('Base Endpoint is required.'),
  cleanServiceInterval: Yup.number()
    .required('Clean Service Interval is required.')
    .positive('Clean Service Interval must be positive.'),
  cleanServiceBatchChunkSize: Yup.number()
    .required('Clean Service Batch Chunk Size is required.')
    .positive('Clean Service Batch Chunk Size must be positive.'),
  useLocalCache: Yup.boolean().required('Use Local Cache is required.'),
  disableJdkLogger: Yup.boolean().required('Disable Jdk Logger is required.'),
  loggingLevel: Yup.string().required('Logging Level is required.'),
  loggingLayout: Yup.string().required('Logging Layout is required.'),
  externalLoggerConfiguration: Yup.string(),
  metricReporterEnabled: Yup.boolean().required('Metric Reporter Enabled is required.'),
  metricReporterInterval: Yup.number()
    .required('Metric Reporter Interval is required.')
    .positive('Metric Reporter Interval must be positive.'),
  metricReporterKeepDataDays: Yup.number()
    .required('Metric Reporter Keep Data Days is required.')
    .positive('Metric Reporter Keep Data Days must be positive.'),
  personCustomObjectClassList: Yup.array().of(Yup.string()),
  // superGluuEnabled: Yup.boolean().required('Enable Super Gluu is required.'),
  hints: Yup.array()
    .of(Yup.string().oneOf(Object.values(PublicKeyCredentialHints), 'Invalid hint value.'))
    .min(1, 'At least one hint is required.')
    .required('Hints are required.'),
})
const staticConfigValidationSchema = Yup.object({
  authenticatorCertsFolder: Yup.string().required('Authenicator Certificates Folder is required.'),
  mdsCertsFolder: Yup.string().required('MDS TOC Certificates Folder is required.'),
  mdsTocsFolder: Yup.string().required('MDS TOC Files Folder is required.'),
  checkU2fAttestations: Yup.boolean().required('Check U2F Attestations is required.'),
  unfinishedRequestExpiration: Yup.number()
    .required('Unfinished Request Expiration is required.')
    .positive('Unfinished Request Expiration must be positive.'),
  authenticationHistoryExpiration: Yup.number()
    .required('Authenication History Expiration  is required.')
    .positive('Authentication History Expiration must be positive.'),
  serverMetadataFolder: Yup.string().required('Server Metadata is required.'),
  userAutoEnrollment: Yup.boolean().required('User Auto Enrollment is required.'),
  metadataRefreshInterval: Yup.number()
    .required('Metadata Refresh Interval is required.')
    .positive('Metadata Refresh Interval must be positive.'),
})

export const validationSchema = {
  dynamicConfigValidationSchema,
  staticConfigValidationSchema,
}
