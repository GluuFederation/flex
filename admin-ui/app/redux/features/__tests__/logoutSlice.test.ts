import reducer, { logoutUser } from '../logoutSlice'
import { STORAGE_KEYS, DEFAULT_LANG } from '@/constants'
import { DEFAULT_THEME } from '@/context/theme/constants'

describe('logoutSlice', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('clears storage and falls back to the default theme and language', () => {
    window.localStorage.setItem('someToken', 'abc')

    reducer({}, logoutUser())

    expect(window.localStorage.getItem('someToken')).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEYS.INIT_THEME)).toBe(DEFAULT_THEME)
    expect(window.localStorage.getItem(STORAGE_KEYS.INIT_LANG)).toBe(DEFAULT_LANG)
  })

  it('keeps the last chosen theme and language across logout', () => {
    window.localStorage.setItem(STORAGE_KEYS.INIT_THEME, 'light')
    window.localStorage.setItem(STORAGE_KEYS.INIT_LANG, 'fr')

    reducer({}, logoutUser())

    expect(window.localStorage.getItem(STORAGE_KEYS.INIT_THEME)).toBe('light')
    expect(window.localStorage.getItem(STORAGE_KEYS.INIT_LANG)).toBe('fr')
  })

  it('keeps the saved page size and log level across logout', () => {
    window.localStorage.setItem(STORAGE_KEYS.PAGING_SIZE, '25')
    window.localStorage.setItem(STORAGE_KEYS.LOG_LEVEL, 'DEBUG')

    reducer({}, logoutUser())

    expect(window.localStorage.getItem(STORAGE_KEYS.PAGING_SIZE)).toBe('25')
    expect(window.localStorage.getItem(STORAGE_KEYS.LOG_LEVEL)).toBe('DEBUG')
  })

  it('preserves a real user config across logout', () => {
    window.localStorage.setItem(STORAGE_KEYS.USER_CONFIG, 'cfg')

    reducer({}, logoutUser())

    expect(window.localStorage.getItem(STORAGE_KEYS.USER_CONFIG)).toBe('cfg')
  })

  it('does not restore a literal "null" user config', () => {
    window.localStorage.setItem(STORAGE_KEYS.USER_CONFIG, 'null')

    reducer({}, logoutUser())

    expect(window.localStorage.getItem(STORAGE_KEYS.USER_CONFIG)).toBeNull()
  })
})
