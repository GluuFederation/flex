import reducer, { logoutUser } from '../logoutSlice'
import { STORAGE_KEYS, DEFAULT_LANG } from '@/constants'
import { DEFAULT_THEME } from '@/context/theme/constants'

describe('logoutSlice', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('clears storage and resets theme and language defaults', () => {
    window.localStorage.setItem('someToken', 'abc')
    window.localStorage.setItem(STORAGE_KEYS.INIT_THEME, 'light')

    reducer({}, logoutUser())

    expect(window.localStorage.getItem('someToken')).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEYS.INIT_THEME)).toBe(DEFAULT_THEME)
    expect(window.localStorage.getItem(STORAGE_KEYS.INIT_LANG)).toBe(DEFAULT_LANG)
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
