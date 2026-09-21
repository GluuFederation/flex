import { logger } from '@/utils/logger'
import { getRootState } from '@/redux/hooks'
import { CEDARLING_LOG_TYPE } from '@/cedarling/constants'
import type { LogArg } from '@/utils/types'

const cedarLogsEnabled = (): boolean => {
  try {
    return getRootState()?.authReducer?.config?.cedarlingLogType === CEDARLING_LOG_TYPE.STD_OUT
  } catch {
    return false
  }
}

export const cedarLogger = {
  trace: (...args: LogArg[]): void => {
    if (cedarLogsEnabled()) logger.trace(...args)
  },
  debug: (...args: LogArg[]): void => {
    if (cedarLogsEnabled()) logger.debug(...args)
  },
  info: (...args: LogArg[]): void => {
    if (cedarLogsEnabled()) logger.info(...args)
  },
  warn: (...args: LogArg[]): void => {
    if (cedarLogsEnabled()) logger.warn(...args)
  },
  error: (...args: LogArg[]): void => logger.error(...args),
}
