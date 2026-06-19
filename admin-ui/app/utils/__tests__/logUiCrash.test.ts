import logUiCrash from '../logUiCrash'
import { logger } from '@/utils/logger'

jest.mock('@/utils/logger', () => ({
  logger: { error: jest.fn(), trace: jest.fn() },
}))

describe('logUiCrash', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('logs a concise message at error level', () => {
    logUiCrash(new Error('boom'), 'at Component')
    expect(logger.error).toHaveBeenCalledWith('UI crash:', 'boom')
  })

  it('logs full details at trace level', () => {
    const error = new Error('boom')
    logUiCrash(error, 'at Component')
    expect(logger.trace).toHaveBeenCalledWith(
      'UI crash details:',
      expect.objectContaining({
        name: 'Error',
        message: 'boom',
        stack: error.stack,
        componentStack: 'at Component',
      }),
    )
  })

  it('preserves the error subclass name', () => {
    logUiCrash(new TypeError('bad type'))
    expect(logger.trace).toHaveBeenCalledWith(
      'UI crash details:',
      expect.objectContaining({ name: 'TypeError', componentStack: undefined }),
    )
  })
})
