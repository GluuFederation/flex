import { logger } from '../logger'
import { saveLogLevel } from '../logLevel'

// The gate reads the level from localStorage via getLogLevel, so drive the real
// level through saveLogLevel rather than mocking the accessor.
describe('logger', () => {
  const spies = {
    trace: jest.spyOn(console, 'trace').mockImplementation(() => {}),
    debug: jest.spyOn(console, 'debug').mockImplementation(() => {}),
    info: jest.spyOn(console, 'info').mockImplementation(() => {}),
    warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
    error: jest.spyOn(console, 'error').mockImplementation(() => {}),
  }

  beforeEach(() => {
    window.localStorage.clear()
    Object.values(spies).forEach((s) => s.mockClear())
  })
  afterAll(() => Object.values(spies).forEach((s) => s.mockRestore()))

  it('emits a message at the configured level', () => {
    saveLogLevel('INFO')
    logger.info('hello')
    expect(spies.info).toHaveBeenCalledWith('[INFO]', 'hello')
  })

  it('emits a message above the configured level', () => {
    saveLogLevel('INFO')
    logger.error('boom')
    expect(spies.error).toHaveBeenCalledWith('[ERROR]', 'boom')
  })

  it('suppresses a message below the configured level', () => {
    saveLogLevel('WARN')
    logger.info('quiet')
    expect(spies.info).not.toHaveBeenCalled()
  })

  it('routes each level to its matching console method', () => {
    saveLogLevel('TRACE')
    logger.trace('t')
    logger.debug('d')
    logger.warn('w')
    logger.error('e')
    expect(spies.trace).toHaveBeenCalledWith('[TRACE]', 't')
    expect(spies.debug).toHaveBeenCalledWith('[DEBUG]', 'd')
    expect(spies.warn).toHaveBeenCalledWith('[WARN]', 'w')
    expect(spies.error).toHaveBeenCalledWith('[ERROR]', 'e')
  })

  it('emits ERROR but drops lower levels when the level is ERROR', () => {
    saveLogLevel('ERROR')
    logger.warn('w')
    logger.error('e')
    expect(spies.warn).not.toHaveBeenCalled()
    expect(spies.error).toHaveBeenCalledWith('[ERROR]', 'e')
  })

  it('defaults to INFO when no level is stored', () => {
    window.localStorage.clear()
    logger.debug('below-default')
    logger.info('at-default')
    expect(spies.debug).not.toHaveBeenCalled()
    expect(spies.info).toHaveBeenCalledWith('[INFO]', 'at-default')
  })

  it('forwards multiple arguments to the console method', () => {
    saveLogLevel('DEBUG')
    logger.debug('ctx', { id: 1 }, 42)
    expect(spies.debug).toHaveBeenCalledWith('[DEBUG]', 'ctx', { id: 1 }, 42)
  })
})
