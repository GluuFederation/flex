import { getLogLevel } from '@/utils/logLevel'
import { LOG_LEVELS } from 'Plugins/auth-server/components/Logging/utils'
import type { LogArg } from '@/utils/types'

type Level = (typeof LOG_LEVELS)[number]

const CALL_LEVEL: Level = 'ERROR'
const CALL_RANK = LOG_LEVELS.indexOf(CALL_LEVEL)

const METHOD_BY_LEVEL: Record<Level, keyof Console> = {
  TRACE: 'trace',
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
}

const cascade = (...args: LogArg[]): void => {
  const from = LOG_LEVELS.indexOf(getLogLevel())
  for (let rank = from; rank <= CALL_RANK; rank++) {
    const level = LOG_LEVELS[rank]
    const print = console[METHOD_BY_LEVEL[level]] as (...a: LogArg[]) => void
    print(`[${level}]`, ...args)
  }
}

export const logger = Object.assign(cascade, {
  log: (...args: LogArg[]): void => {
    console.log(...args)
  },
})
