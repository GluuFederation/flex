import * as Yup from 'yup'

export const dynamicConfigInitValues = (staticConfiguration) => {
  return {
    issuer: staticConfiguration?.issuer || '',
    baseEndpoint: staticConfiguration?.baseEndpoint || '',
    cleanServiceInterval: staticConfiguration?.cleanServiceInterval || '',
    cleanServiceBatchChunkSize:
      staticConfiguration?.cleanServiceBatchChunkSize || '',
    useLocalCache: staticConfiguration?.useLocalCache || '',
    disableJdkLogger: staticConfiguration?.disableJdkLogger || '',
    loggingLevel: staticConfiguration?.loggingLevel || '',
    loggingLayout: staticConfiguration?.loggingLayout || '',
    externalLoggerConfiguration:
      staticConfiguration?.externalLoggerConfiguration || '',
    metricReporterEnabled: staticConfiguration?.metricReporterEnabled,
    metricReporterInterval: staticConfiguration?.metricReporterInterval || '',
    metricReporterKeepDataDays:
      staticConfiguration?.metricReporterKeepDataDays || '',
    personCustomObjectClassList:
      staticConfiguration?.personCustomObjectClassList || [],
    superGluuEnabled: staticConfiguration?.superGluuEnabled,
  }
}

export const dynamicConfigValidationSchema = Yup.object({
  issuer: Yup.string().required('Issuer is required.'),
  baseEndpoint: Yup.string().required('Base Endpoint is required.'),
  cleanServiceInterval: Yup.string().required(
    'Clean Service Interval is required.'
  ),
  cleanServiceBatchChunkSize: Yup.string().required(
    'Clean Service Batch Chunk Size is required.'
  ),
  useLocalCache: Yup.boolean().required('Use Local Cache is required.'),
  disableJdkLogger: Yup.boolean().required('Disable Jdk Logger is required.'),
  loggingLevel: Yup.string().required('Logging Level is required.'),
  loggingLayout: Yup.string().required('Logging Layout is required.'),
  metricReporterEnabled: Yup.boolean().required(
    'Metric Reporter Enabled is required.'
  ),
  metricReporterInterval: Yup.number().required(
    'Metric Reporter Interval is required.'
  ),
  metricReporterKeepDataDays: Yup.number().required(
    'Metric Reporter Keep Data Days is required.'
  ),
  superGluuEnabled: Yup.boolean().required('Enable Super Gluu is required.'),
})
