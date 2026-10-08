import { LOG_LEVELS } from 'Plugins/auth-server/components/Logging/utils'
import { STORAGE_KEYS } from '@/constants'

export type LogLevel = (typeof LOG_LEVELS)[number]

const STORAGE_KEY = STORAGE_KEYS.LOG_LEVEL

const isLogLevel = (value: string | null | undefined): value is LogLevel =>
  value != null && (LOG_LEVELS as readonly string[]).includes(value)

export const getLogLevel = (defaultLevel: LogLevel = 'INFO'): LogLevel => {
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
