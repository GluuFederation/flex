import { sessionStore, storage } from '../storage'

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

  describe('keys', () => {
    it('lists the stored keys', () => {
      storage.set('a', '1')
      storage.set('b', '2')
      expect(storage.keys().sort()).toEqual(['a', 'b'])
    })

    it('returns an empty list when nothing is stored', () => {
      expect(storage.keys()).toEqual([])
    })
  })
})

describe('sessionStore', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('keeps values in sessionStorage, not localStorage', () => {
    sessionStore.setJSON('tokens', { a: '1' })
    expect(sessionStore.getJSON('tokens')).toEqual({ a: '1' })
    expect(window.sessionStorage.getItem('tokens')).toBe('{"a":"1"}')
    expect(window.localStorage.getItem('tokens')).toBeNull()
  })

  it('removes a key', () => {
    sessionStore.set('k', 'v')
    sessionStore.remove('k')
    expect(sessionStore.get('k')).toBeNull()
  })

  it('lists only the keys of sessionStorage', () => {
    sessionStore.set('tab', '1')
    window.localStorage.setItem('shared', '1')
    expect(sessionStore.keys()).toEqual(['tab'])
  })
})
