import { logger } from '@/utils/logger'

const logUiCrash = (error: Error, componentStack?: string | null) => {
  logger.error('UI crash:', error.message)
  logger.trace('UI crash details:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    componentStack: componentStack ?? undefined,
  })
}

export default logUiCrash
