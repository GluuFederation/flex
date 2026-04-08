import type { LoggingLayout, LoggingLevel } from '../utils'

export type LoggingConfigLike = {
  loggingLevel?: string | null
  loggingLayout?: string | null
  httpLoggingEnabled?: boolean | null
  disableJdkLogger?: boolean | null
  enabledOAuthAuditLogging?: boolean | null
}

export type LoggingFormValues = {
  loggingLevel: LoggingLevel
  loggingLayout: LoggingLayout
  httpLoggingEnabled: boolean
  disableJdkLogger: boolean
  enabledOAuthAuditLogging: boolean
}
