import { getLogLevel } from '@/utils/logLevel'
import { LOG_LEVELS } from 'Plugins/auth-server/components/Logging/utils'
import type { LogArg } from '@/utils/types'

type Level = (typeof LOG_LEVELS)[number]

// every logger(...) call is emitted at this level
const CALL_LEVEL: Level = 'ERROR'

const METHOD_BY_LEVEL: Record<Level, keyof Console> = {
  TRACE: 'trace',
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
}

// Custom %c styling for trace/debug/info; warn/error keep their native coloured rows.
const BASE_STYLE = 'padding: 3px 6px; border-radius: 3px; font-weight: bold;'
const STYLE_BY_LEVEL: Partial<Record<Level, string>> = {
  TRACE: `background: rgba(120, 120, 120, 0.22); color: #cfcfcf; ${BASE_STYLE}`,
  DEBUG: `background: rgba(33, 150, 243, 0.22); color: #90caf9; ${BASE_STYLE}`,
  INFO: `background: rgba(76, 175, 80, 0.22); color: #a5d6a7; ${BASE_STYLE}`,
}

const rankOf = (level: Level): number => LOG_LEVELS.indexOf(level)

// Unified logger: prints the message at every level from the selected level up to
// CALL_LEVEL, each line styled for its own level (selected TRACE -> 5 lines ... ERROR -> 1).
export const logger = (...args: LogArg[]): void => {
  const from = rankOf(getLogLevel())
  const to = rankOf(CALL_LEVEL)
  for (let rank = from; rank <= to; rank++) {
    const level = LOG_LEVELS[rank]
    const print = console[METHOD_BY_LEVEL[level]] as (...a: LogArg[]) => void
    const style = STYLE_BY_LEVEL[level]
    if (style) {
      print(`%c[${level}]`, style, ...args)
    } else {
      print(`[${level}]`, ...args)
    }
  }
}
