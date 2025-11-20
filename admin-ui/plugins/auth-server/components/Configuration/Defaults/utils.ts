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

const isValidLevel = (val: unknown): val is LoggingLevel =>
  typeof val === 'string' && LOG_LEVELS.includes(val as LoggingLevel)

const isValidLayout = (val: unknown): val is LoggingLayout =>
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

export function getMergedValues<T extends Record<string, unknown>>(
  original: T,
  updated: Partial<T>,
): T {
  return { ...original, ...updated }
}

export function getChangedFields<T extends Record<string, unknown>>(
  original: T,
  updated: Partial<T>,
): Partial<Record<keyof T, { oldValue: unknown; newValue: unknown }>> {
  const changed: Partial<Record<keyof T, { oldValue: unknown; newValue: unknown }>> = {}
  ;(Object.keys(updated) as Array<keyof T>).forEach((key) => {
    const newValue = updated[key]
    const oldValue = original[key]
    if (newValue !== undefined && newValue !== oldValue) {
      changed[key] = { oldValue, newValue }
    }
  })
  return changed
}
