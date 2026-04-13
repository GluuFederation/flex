import { jansLockConstants } from 'Plugins/jans-lock/helper/constants'

describe('jansLockConstants', () => {
  it('has correct DOC_CATEGORY', () => {
    expect(jansLockConstants.DOC_CATEGORY).toBe('jans_lock')
  })

  it('has correct BINARY_VALUES', () => {
    expect(jansLockConstants.BINARY_VALUES.TRUE).toBe('true')
    expect(jansLockConstants.BINARY_VALUES.FALSE).toBe('false')
  })

  it('has all expected logging levels', () => {
    expect(jansLockConstants.LOGGING_LEVELS).toEqual([
      'TRACE',
      'DEBUG',
      'INFO',
      'WARN',
      'ERROR',
      'FATAL',
      'OFF',
    ])
  })

  it('logging levels are strings', () => {
    jansLockConstants.LOGGING_LEVELS.forEach((level) => {
      expect(typeof level).toBe('string')
    })
  })
})
