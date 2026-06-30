import { storage } from '../storage'

const realLocalStorage = window.localStorage

// Swap window.localStorage for one whose chosen method throws, to exercise the
// try/catch branches (jsdom's native localStorage methods are not spyable).
const withThrowingStorage = (method: 'getItem' | 'setItem' | 'removeItem', fn: () => void) => {
  const throwing: Storage = {
    getItem: () => '',
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  }
  throwing[method] = () => {
    throw new Error(`${method} fail`)
  }
  Object.defineProperty(window, 'localStorage', { value: throwing, configurable: true })
  try {
    fn()
  } finally {
    Object.defineProperty(window, 'localStorage', { value: realLocalStorage, configurable: true })
  }
}

describe('storage', () => {
  let consoleError: jest.SpyInstance

  beforeEach(() => {
    window.localStorage.clear()
    // storage logs failures via logger.error, which routes to console.error.
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('get / set', () => {
    it('stores and reads back a string value', () => {
      storage.set('k', 'v')
      expect(storage.get('k')).toBe('v')
    })

    it('returns null for a missing key', () => {
      expect(storage.get('absent')).toBeNull()
    })

    it('returns null and logs when getItem throws', () => {
      withThrowingStorage('getItem', () => {
        expect(storage.get('k')).toBeNull()
      })
      expect(consoleError).toHaveBeenCalled()
    })

    it('logs when setItem throws', () => {
      withThrowingStorage('setItem', () => {
        storage.set('k', 'v')
      })
      expect(consoleError).toHaveBeenCalled()
    })
  })

  describe('getJSON / setJSON', () => {
    it('round-trips an object', () => {
      storage.setJSON('obj', { a: 1, b: ['x'] })
      expect(storage.getJSON('obj')).toEqual({ a: 1, b: ['x'] })
    })

    it('returns null for a missing key', () => {
      expect(storage.getJSON('absent')).toBeNull()
    })

    it('returns null and logs when the stored value is not valid JSON', () => {
      window.localStorage.setItem('bad', '{not json')
      expect(storage.getJSON('bad')).toBeNull()
      expect(consoleError).toHaveBeenCalled()
    })
  })

  describe('remove / clear', () => {
    it('removes a single key', () => {
      storage.set('k', 'v')
      storage.remove('k')
      expect(storage.get('k')).toBeNull()
    })

    it('clears all keys', () => {
      storage.set('a', '1')
      storage.set('b', '2')
      storage.clear()
      expect(storage.get('a')).toBeNull()
      expect(storage.get('b')).toBeNull()
    })

    it('logs when remove throws', () => {
      withThrowingStorage('removeItem', () => {
        storage.remove('k')
      })
      expect(consoleError).toHaveBeenCalled()
    })
  })
})
