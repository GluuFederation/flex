import { LOG_LEVELS } from 'Plugins/auth-server/components/Logging/utils'

export type LogLevel = (typeof LOG_LEVELS)[number]

export const DEFAULT_LOG_LEVEL: LogLevel = 'INFO'

const STORAGE_KEY = 'gluu.logLevel'

const isLogLevel = (value: unknown): value is LogLevel =>
  typeof value === 'string' && (LOG_LEVELS as readonly string[]).includes(value)

export const getLogLevel = (defaultLevel: LogLevel = DEFAULT_LOG_LEVEL): LogLevel => {
  try {
    const stored = window.localStorage?.getItem(STORAGE_KEY)
    return isLogLevel(stored) ? stored : defaultLevel
  } catch {
    return defaultLevel
  }
}

export const saveLogLevel = (level: LogLevel): void => {
  if (!isLogLevel(level)) return
  try {
    window.localStorage?.setItem(STORAGE_KEY, level)
  } catch {
    /* localStorage unavailable (SSR / private mode / quota) */
  }
}
