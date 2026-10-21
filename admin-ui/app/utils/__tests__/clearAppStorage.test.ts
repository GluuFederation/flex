import { STORAGE_KEYS } from '@/constants'
import clearAppStorage from '../clearAppStorage'

describe('clearAppStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('keeps the last sign-out time so tabs that missed it still follow it', () => {
    window.localStorage.setItem(STORAGE_KEYS.SIGNED_OUT_AT, '1792576800000')

    clearAppStorage()

    expect(window.localStorage.getItem(STORAGE_KEYS.SIGNED_OUT_AT)).toBe('1792576800000')
  })

  it('does not record a sign-out when there was none', () => {
    clearAppStorage()

    expect(window.localStorage.getItem(STORAGE_KEYS.SIGNED_OUT_AT)).toBeNull()
  })

  it('still removes everything that is not kept', () => {
    window.localStorage.setItem(STORAGE_KEYS.ISSUER, 'https://issuer.example.com')
    window.localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, '1792576800000')

    clearAppStorage()

    expect(window.localStorage.getItem(STORAGE_KEYS.ISSUER)).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY)).toBeNull()
  })
})
