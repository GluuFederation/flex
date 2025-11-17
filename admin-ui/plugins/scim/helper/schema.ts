import * as Yup from 'yup'
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

export const scimConfigurationSchema = Yup.object({
  baseDN: Yup.string(),
  applicationUrl: Yup.string().test(
    'valid-secure-url',
    'Application URL must be a valid URL with http:// or https:// protocol',
    isSecureUrl,
  ),
  baseEndpoint: Yup.string(),
  personCustomObjectClass: Yup.string(),
  oxAuthIssuer: Yup.string(),
  protectionMode: Yup.string().oneOf(
    [...PROTECTION_MODES, ''],
    'Protection Mode must be OAUTH or BYPASS',
  ),
  maxCount: Yup.number()
    .typeError('Max Count must be a number')
    .positive('Max Count must be positive')
    .integer('Max Count must be an integer')
    .max(2147483647, 'Max Count cannot exceed 2,147,483,647'),
  bulkMaxOperations: Yup.number()
    .typeError('Bulk Max Operations must be a number')
    .positive('Bulk Max Operations must be positive')
    .integer('Bulk Max Operations must be an integer')
    .max(100000, 'Bulk Max Operations cannot exceed 100,000'),
  bulkMaxPayloadSize: Yup.number()
    .typeError('Bulk Max Payload Size must be a number')
    .positive('Bulk Max Payload Size must be positive')
    .integer('Bulk Max Payload Size must be an integer')
    .max(104857600, 'Bulk Max Payload Size cannot exceed 100 MB (104,857,600 bytes)'),
  userExtensionSchemaURI: Yup.string(),
  loggingLevel: Yup.string(),
  loggingLayout: Yup.string(),
  metricReporterInterval: Yup.number()
    .typeError('Metric Reporter Interval must be a number')
    .positive('Metric Reporter Interval must be positive')
    .integer('Metric Reporter Interval must be an integer')
    .max(86400, 'Metric Reporter Interval cannot exceed 86,400 seconds (24 hours)'),
  metricReporterKeepDataDays: Yup.number()
    .typeError('Metric Reporter Keep Data Days must be a number')
    .positive('Metric Reporter Keep Data Days must be positive')
    .integer('Metric Reporter Keep Data Days must be an integer')
    .max(3650, 'Metric Reporter Keep Data Days cannot exceed 3,650 days (10 years)'),
  metricReporterEnabled: Yup.boolean(),
  disableJdkLogger: Yup.boolean(),
  disableLoggerTimer: Yup.boolean(),
  useLocalCache: Yup.boolean(),
  skipDefinedPasswordValidation: Yup.boolean(),
})
