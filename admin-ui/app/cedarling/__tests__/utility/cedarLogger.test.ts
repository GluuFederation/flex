import { cedarLogger } from '@/cedarling/utility/cedarLogger'
import { getRootState } from '@/redux/hooks'
import { logger } from '@/utils/logger'
import { CEDARLING_LOG_TYPE } from '@/cedarling/constants'

jest.mock('@/redux/hooks', () => ({ getRootState: jest.fn() }))
jest.mock('@/utils/logger', () => ({
  logger: {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

const mockGetRootState = getRootState as jest.Mock

const stateWithLogType = (cedarlingLogType?: string) => ({
  authReducer: { config: { cedarlingLogType } },
})

describe('cedarLogger while Cedarling logs are switched on', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetRootState.mockReturnValue(stateWithLogType(CEDARLING_LOG_TYPE.STD_OUT))
  })

  it('forwards each level to the shared logger', () => {
    cedarLogger.trace('t')
    cedarLogger.debug('d')
    cedarLogger.info('i')
    cedarLogger.warn('w')

    expect(logger.trace).toHaveBeenCalledWith('t')
    expect(logger.debug).toHaveBeenCalledWith('d')
    expect(logger.info).toHaveBeenCalledWith('i')
    expect(logger.warn).toHaveBeenCalledWith('w')
  })

  it('passes every argument through untouched', () => {
    const payload = { resource: 'Webhooks' }
    cedarLogger.debug('denied', payload)

    expect(logger.debug).toHaveBeenCalledWith('denied', payload)
  })
})

describe('cedarLogger while Cedarling logs are switched off', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetRootState.mockReturnValue(stateWithLogType(CEDARLING_LOG_TYPE.OFF))
  })

  it('emits nothing below error level', () => {
    cedarLogger.trace('t')
    cedarLogger.debug('d')
    cedarLogger.info('i')
    cedarLogger.warn('w')

    expect(logger.trace).not.toHaveBeenCalled()
    expect(logger.debug).not.toHaveBeenCalled()
    expect(logger.info).not.toHaveBeenCalled()
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it('still reports errors so failures stay visible in support reports', () => {
    cedarLogger.error('Cedarling WASM initialization failed:', 'boom')

    expect(logger.error).toHaveBeenCalledWith('Cedarling WASM initialization failed:', 'boom')
  })
})

describe('cedarLogger before the configuration is known', () => {
  beforeEach(() => jest.clearAllMocks())

  it('stays silent when the config has no log type yet', () => {
    mockGetRootState.mockReturnValue(stateWithLogType(undefined))
    cedarLogger.info('i')

    expect(logger.info).not.toHaveBeenCalled()
  })

  it('stays silent when the store cannot be read', () => {
    mockGetRootState.mockImplementation(() => {
      throw new Error('store unavailable')
    })
    cedarLogger.info('i')

    expect(logger.info).not.toHaveBeenCalled()
  })
})
