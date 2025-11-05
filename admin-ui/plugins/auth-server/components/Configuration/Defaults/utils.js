export const LOG_LEVELS = ['TRACE', 'DEBUG', 'INFO', 'ERROR', 'WARN']
export const LOG_LAYOUTS = ['text', 'json']

export const getLoggingInitialValues = (logging) => ({
  loggingLevel: logging?.loggingLevel,
  loggingLayout: logging?.loggingLayout,
  httpLoggingEnabled: logging?.httpLoggingEnabled,
  disableJdkLogger: logging?.disableJdkLogger,
  enabledOAuthAuditLogging: logging?.enabledOAuthAuditLogging,
})
