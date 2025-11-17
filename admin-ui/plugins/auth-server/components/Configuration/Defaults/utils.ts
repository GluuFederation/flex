import { cloneDeep } from 'lodash'

export const LOG_LEVELS = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'] as const
export const LOG_LAYOUTS = ['text', 'json'] as const

export type LoggingLevel = (typeof LOG_LEVELS)[number]
export type LoggingLayout = (typeof LOG_LAYOUTS)[number]

export interface LoggingConfigLike {
  loggingLevel?: string | null
  loggingLayout?: string | null
  httpLoggingEnabled?: boolean | null
  disableJdkLogger?: boolean | null
  enabledOAuthAuditLogging?: boolean | null
}

export interface LoggingFormValues {
  loggingLevel: LoggingLevel
  loggingLayout: LoggingLayout
  httpLoggingEnabled: boolean
  disableJdkLogger: boolean
  enabledOAuthAuditLogging: boolean
}

export const getLoggingInitialValues = (logging?: LoggingConfigLike | null): LoggingFormValues => {
  const safeLogging = cloneDeep(logging) ?? {}

  const level = safeLogging.loggingLevel || LOG_LEVELS[0]
  const layout = safeLogging.loggingLayout || LOG_LAYOUTS[0]

  return {
    loggingLevel: LOG_LEVELS.includes(level as LoggingLevel)
      ? (level as LoggingLevel)
      : LOG_LEVELS[0],
    loggingLayout: LOG_LAYOUTS.includes(layout as LoggingLayout)
      ? (layout as LoggingLayout)
      : LOG_LAYOUTS[0],
    httpLoggingEnabled: Boolean(safeLogging.httpLoggingEnabled),
    disableJdkLogger: Boolean(safeLogging.disableJdkLogger),
    enabledOAuthAuditLogging: Boolean(safeLogging.enabledOAuthAuditLogging),
  }
}
