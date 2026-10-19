import { authTokensTransform } from '@/redux/store/authTokensTransform'
import clearAppStorage from '@/utils/clearAppStorage'
import { STORAGE_KEYS } from '@/constants'
import type { AuthState } from '@/redux/features/types/authTypes'

const signedIn = {
  isAuthenticated: true,
  userinfo: { inum: 'u-1' },
  userinfo_jwt: 'userinfo-jwt',
  idToken: 'id-token',
  jwtToken: 'access-token',
  issuer: 'https://issuer.example.com',
  hasSession: true,
} as object as AuthState

const storedTokens = () => {
  const raw = window.sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKENS)
  return raw ? JSON.parse(raw) : null
}

describe('authTokensTransform', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('keeps the tokens out of what goes to localStorage and in sessionStorage', () => {
    const persisted = authTokensTransform.in(signedIn, 'authReducer', {})

    expect(persisted).not.toHaveProperty('userinfo_jwt')
    expect(persisted).not.toHaveProperty('idToken')
    expect(persisted).not.toHaveProperty('jwtToken')
    expect(persisted).toMatchObject({ issuer: 'https://issuer.example.com', hasSession: true })
    expect(storedTokens()).toEqual({
      userinfo_jwt: 'userinfo-jwt',
      idToken: 'id-token',
      jwtToken: 'access-token',
    })
  })

  it('puts the tokens back on reload in the same tab', () => {
    const persisted = authTokensTransform.in(signedIn, 'authReducer', {})

    const restored = authTokensTransform.out(persisted, 'authReducer', {})

    expect(restored).toMatchObject({
      userinfo_jwt: 'userinfo-jwt',
      idToken: 'id-token',
      jwtToken: 'access-token',
      hasSession: true,
    })
  })

  it('ignores tokens left in localStorage by older builds when the tab has none', () => {
    const restored = authTokensTransform.out(signedIn, 'authReducer', {})

    expect(restored).toMatchObject({ userinfo_jwt: null, idToken: null, jwtToken: null })
    expect(restored).toMatchObject({ hasSession: true, issuer: 'https://issuer.example.com' })
  })

  it('drops the stored tokens once the auth state no longer has them', () => {
    authTokensTransform.in(signedIn, 'authReducer', {})

    authTokensTransform.in(
      { ...signedIn, userinfo_jwt: null, idToken: null, jwtToken: null },
      'authReducer',
      {},
    )

    expect(storedTokens()).toBeNull()
  })

  it('clears the stored tokens on sign-out', () => {
    authTokensTransform.in(signedIn, 'authReducer', {})

    clearAppStorage()

    expect(storedTokens()).toBeNull()
  })

  it('leaves other reducers untouched', () => {
    const scopes = { items: ['a'], userinfo_jwt: 'not-a-token' } as object as AuthState

    expect(authTokensTransform.in(scopes, 'scopeReducer', {})).toBe(scopes)
  })
})
