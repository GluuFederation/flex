import { clearLegacyAuthStorage } from '../legacyAuthStorage'

describe('clearLegacyAuthStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('removes the Redux state older builds saved, tokens included', () => {
    window.localStorage.setItem('persist:root', '{"authReducer":"{\\"jwtToken\\":\\"secret\\"}"}')

    clearLegacyAuthStorage()

    expect(window.localStorage.getItem('persist:root')).toBeNull()
  })

  it('removes sign-in requests older builds left in localStorage', () => {
    window.localStorage.setItem('appauth_current_authorization_request', 'abc')
    window.localStorage.setItem('abc_appauth_authorization_request', '{}')
    window.localStorage.setItem('abc_appauth_authorization_service_configuration', '{}')

    clearLegacyAuthStorage()

    expect(Object.keys(window.localStorage)).toEqual([])
  })

  it('keeps preferences and the issuer', () => {
    window.localStorage.setItem('initTheme', 'dark')
    window.localStorage.setItem('gluu.pagingSize', '25')
    window.localStorage.setItem('issuer', 'https://issuer.example.com')

    clearLegacyAuthStorage()

    expect(window.localStorage.getItem('initTheme')).toBe('dark')
    expect(window.localStorage.getItem('gluu.pagingSize')).toBe('25')
    expect(window.localStorage.getItem('issuer')).toBe('https://issuer.example.com')
  })
})
