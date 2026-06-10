import { getLogLevel } from '@/utils/logLevel'
import { LOG_LEVELS } from 'Plugins/auth-server/components/Logging/utils'
import type { LogArg } from '@/utils/types'

type Level = (typeof LOG_LEVELS)[number]

const METHOD_BY_LEVEL: Record<Level, keyof Console> = {
  TRACE: 'trace',
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
}

const rankOf = (level: Level): number => LOG_LEVELS.indexOf(level)

const emit =
  (callLevel: Level) =>
  (...args: LogArg[]) => {
    const from = rankOf(getLogLevel())
    const to = rankOf(callLevel)
    for (let rank = from; rank <= to; rank++) {
      const level = LOG_LEVELS[rank]
      const print = console[METHOD_BY_LEVEL[level]] as (...a: LogArg[]) => void
      print(`[${level}]`, ...args)
    }
  }

export const logger = {
  trace: emit('TRACE'),
  debug: emit('DEBUG'),
  info: emit('INFO'),
  warn: emit('WARN'),
  error: emit('ERROR'),
}
