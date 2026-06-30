import { getLogLevel, saveLogLevel } from '../logLevel'
import type { LogLevel } from '../logLevel'

const STORAGE_KEY = 'gluu.logLevel'

describe('logLevel', () => {
  beforeEach(() => {
    window.localStorage.clear()
    jest.restoreAllMocks()
  })

  describe('getLogLevel', () => {
    it('returns the default INFO level when nothing is stored', () => {
      expect(getLogLevel()).toBe('INFO')
    })

    it('returns a provided default when nothing is stored', () => {
      expect(getLogLevel('WARN')).toBe('WARN')
    })

    it('returns the stored level when it is a valid log level', () => {
      window.localStorage.setItem(STORAGE_KEY, 'ERROR')
      expect(getLogLevel()).toBe('ERROR')
    })

    it('falls back to the default when the stored value is not a valid level', () => {
      window.localStorage.setItem(STORAGE_KEY, 'NOPE')
      expect(getLogLevel('DEBUG')).toBe('DEBUG')
    })

    it('falls back to the default when localStorage access throws', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked')
      })
      expect(getLogLevel('TRACE')).toBe('TRACE')
    })
  })

  describe('saveLogLevel', () => {
    it('persists a valid log level', () => {
      saveLogLevel('DEBUG')
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe('DEBUG')
    })

    it('ignores an invalid log level', () => {
      const invalid = 'BOGUS' as LogLevel
      saveLogLevel(invalid)
      expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
    })

    it('does not throw when localStorage access fails', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota')
      })
      expect(() => saveLogLevel('WARN')).not.toThrow()
    })
  })
})
