import { isDevelopment } from '@/utils/env'

export const devLogger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) console.log(...args)
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) console.warn(...args)
  },
  error: (...args: unknown[]) => {
    if (isDevelopment) console.error(...args)
  },
  debug: (...args: unknown[]) => {
    if (isDevelopment) console.debug(...args)
  },
}
