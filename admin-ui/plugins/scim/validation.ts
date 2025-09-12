import * as Yup from 'yup'

/**
 * Validation schema for SCIM configuration form
 * Contains all validation rules for SCIM configuration fields
 */
export const scimConfigurationValidationSchema = Yup.object({
  baseDN: Yup.string().required('Base DN is required.'),
  applicationUrl: Yup.string()
    .url('Please enter a valid URL.')
    .required('Application URL is required.'),
  baseEndpoint: Yup.string()
    .url('Please enter a valid endpoint URL.')
    .required('Base Endpoint is required.'),
  personCustomObjectClass: Yup.string(),
  oxAuthIssuer: Yup.string()
    .url('Please enter a valid issuer URL.')
    .required('OxAuth Issuer is required.'),
  maxCount: Yup.number()
    .positive('Max Count must be a positive number.')
    .integer('Max Count must be an integer.')
    .required('Max Count is required.'),
  bulkMaxOperations: Yup.number()
    .positive('Bulk Max Operations must be a positive number.')
    .integer('Bulk Max Operations must be an integer.')
    .required('Bulk Max Operations is required.'),
  bulkMaxPayloadSize: Yup.number()
    .positive('Bulk Max Payload Size must be a positive number.')
    .integer('Bulk Max Payload Size must be an integer.')
    .required('Bulk Max Payload Size is required.'),
  userExtensionSchemaURI: Yup.string(),
  loggingLevel: Yup.string()
    .oneOf(['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF'], 'Invalid logging level.')
    .required('Logging Level is required.'),
  loggingLayout: Yup.string(),
  externalLoggerConfiguration: Yup.string(),
  metricReporterInterval: Yup.number()
    .positive('Metric Reporter Interval must be a positive number.')
    .integer('Metric Reporter Interval must be an integer.'),
  metricReporterKeepDataDays: Yup.number()
    .positive('Metric Reporter Keep Data Days must be a positive number.')
    .integer('Metric Reporter Keep Data Days must be an integer.'),
  metricReporterEnabled: Yup.boolean(),
  disableJdkLogger: Yup.boolean(),
  useLocalCache: Yup.boolean(),
})
export const LOGGING_LEVELS = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF']
