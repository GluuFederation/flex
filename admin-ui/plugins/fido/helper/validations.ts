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
  hints: Yup.array()
    .of(Yup.string().oneOf(Object.values(PublicKeyCredentialHints), 'Invalid hint value.'))
    .min(1, 'At least one hint is required.')
    .required('Hints are required.'),
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
})

export const validationSchema: Record<
  string,
  typeof dynamicConfigValidationSchema | typeof staticConfigValidationSchema
> = {
  dynamicConfigValidationSchema,
  staticConfigValidationSchema,
}
