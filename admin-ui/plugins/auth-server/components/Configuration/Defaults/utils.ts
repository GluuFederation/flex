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

/**
 * Type guard to check if a value is a valid LoggingLevel
 */
const isValidLevel = (val: unknown): val is LoggingLevel =>
  typeof val === 'string' && LOG_LEVELS.includes(val as LoggingLevel)

/**
 * Type guard to check if a value is a valid LoggingLayout
 */
const isValidLayout = (val: unknown): val is LoggingLayout =>
  typeof val === 'string' && LOG_LAYOUTS.includes(val as LoggingLayout)

/**
 * Converts logging configuration to form initial values with proper validation
 */
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

/**
 * Merges original and updated values, with updated values taking precedence
 * @param original - The original values
 * @param updated - The updated values
 * @returns Merged object with updated values taking precedence
 */
export function getMergedValues<T extends Record<string, unknown>>(
  original: T | null,
  updated: Partial<T>,
): T {
  if (!original) return updated as T
  return { ...original, ...updated }
}

/**
 * Gets the fields that changed between original and updated values
 * @param original - The original values
 * @param updated - The updated values
 * @returns Object containing only the changed fields
 */
export function getChangedFields<T extends Record<string, unknown>>(
  original: T | null,
  updated: Partial<T>,
): Partial<T> {
  if (!original) return updated

  const changed: Partial<T> = {}
  ;(Object.keys(updated) as Array<keyof T>).forEach((key) => {
    if (updated[key] !== original[key] && updated[key] !== undefined) {
      changed[key] = updated[key]
    }
  })
  return changed
}
