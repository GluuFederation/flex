import { isDevelopment } from '@/utils/env'
import type { LogArg } from '@/utils/types'

export const devLogger = {
  log: (...args: LogArg[]) => {
    if (isDevelopment) console.log(...args)
  },
  warn: (...args: LogArg[]) => {
    if (isDevelopment) console.warn(...args)
  },
  error: (...args: LogArg[]) => {
    if (isDevelopment) console.error(...args)
  },
  debug: (...args: LogArg[]) => {
    if (isDevelopment) console.debug(...args)
  },
}
