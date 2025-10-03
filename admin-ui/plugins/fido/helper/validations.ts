import * as Yup from 'yup'
import { PublicKeyCredentialHints } from '../types'

const dynamicConfigValidationSchema = Yup.object({
  issuer: Yup.string().required('Issuer is required.'),
  baseEndpoint: Yup.string().required('Base Endpoint is required.'),
  cleanServiceInterval: Yup.string().required('Clean Service Interval is required.'),
  cleanServiceBatchChunkSize: Yup.string().required('Clean Service Batch Chunk Size is required.'),
  useLocalCache: Yup.boolean().required('Use Local Cache is required.'),
  disableJdkLogger: Yup.boolean().required('Disable Jdk Logger is required.'),
  loggingLevel: Yup.string().required('Logging Level is required.'),
  loggingLayout: Yup.string().required('Logging Layout is required.'),
  metricReporterEnabled: Yup.boolean().required('Metric Reporter Enabled is required.'),
  metricReporterInterval: Yup.number().required('Metric Reporter Interval is required.'),
  metricReporterKeepDataDays: Yup.number().required('Metric Reporter Keep Data Days is required.'),
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
  unfinishedRequestExpiration: Yup.string().required('Unfinished Request Expiration is required.'),
  authenticationHistoryExpiration: Yup.string().required(
    'Authenication History Expiration  is required.',
  ),
  serverMetadataFolder: Yup.string().required('Server Metadata is required.'),
  userAutoEnrollment: Yup.boolean().required('User Auto Enrollment is required.'),
})

export const validationSchema = {
  dynamicConfigValidationSchema,
  staticConfigValidationSchema,
}
