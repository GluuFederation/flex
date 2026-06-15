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

const emit = (level: Level, args: LogArg[]): void => {
  if (LOG_LEVELS.indexOf(level) < LOG_LEVELS.indexOf(getLogLevel())) return
  const print = console[METHOD_BY_LEVEL[level]] as (...a: LogArg[]) => void
  print(`[${level}]`, ...args)
}

export const logger = {
  trace: (...args: LogArg[]): void => emit('TRACE', args),
  debug: (...args: LogArg[]): void => emit('DEBUG', args),
  info: (...args: LogArg[]): void => emit('INFO', args),
  warn: (...args: LogArg[]): void => emit('WARN', args),
  error: (...args: LogArg[]): void => emit('ERROR', args),
}
