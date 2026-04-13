import type { ChangedFields, LoggingConfigLike, LoggingFormValues } from './types'

export const LOG_LEVELS = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'] as const
export const LOG_LAYOUTS = ['text', 'json'] as const

export type LoggingLevel = (typeof LOG_LEVELS)[number]
export type LoggingLayout = (typeof LOG_LAYOUTS)[number]

export type { LoggingConfigLike, LoggingFormValues }

const isValidLevel = (val: string | null | undefined): val is LoggingLevel =>
  typeof val === 'string' && LOG_LEVELS.includes(val as LoggingLevel)

const isValidLayout = (val: string | null | undefined): val is LoggingLayout =>
  typeof val === 'string' && LOG_LAYOUTS.includes(val as LoggingLayout)

export const getLoggingInitialValues = (logging?: LoggingConfigLike | null): LoggingFormValues => {
  if (!logging) {
    return {
      loggingLevel: LOG_LEVELS[0],
      loggingLayout: LOG_LAYOUTS[0],
      httpLoggingEnabled: false,
      disableJdkLogger: false,
      enabledOAuthAuditLogging: false,
    }
  }

  return {
    loggingLevel: isValidLevel(logging.loggingLevel) ? logging.loggingLevel : LOG_LEVELS[0],
    loggingLayout: isValidLayout(logging.loggingLayout) ? logging.loggingLayout : LOG_LAYOUTS[0],
    httpLoggingEnabled: Boolean(logging.httpLoggingEnabled),
    disableJdkLogger: Boolean(logging.disableJdkLogger),
    enabledOAuthAuditLogging: Boolean(logging.enabledOAuthAuditLogging),
  }
}

export const getMergedValues = <T extends object>(original: T, updated: Partial<T>): T => {
  return { ...original, ...updated }
}

export const getChangedFields = <T extends object>(original: T, updated: T): ChangedFields<T> => {
  const changed: ChangedFields<T> = {}
  ;(Object.keys(updated) as Array<keyof T>).forEach((key) => {
    const newValue = updated[key]
    const oldValue = original[key]
    if (newValue !== undefined && newValue !== oldValue) {
      changed[key] = { oldValue, newValue }
    }
  })
  return changed
}
