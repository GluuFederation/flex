import { STORAGE_KEYS } from '@/constants'
import {
  EMPTY_SESSION_TOKENS,
  clearSessionTokens,
  readSessionTokens,
  writeSessionTokens,
} from '../sessionTokens'

const tokens = { userinfo_jwt: 'userinfo-jwt', idToken: 'id-token', jwtToken: 'access-token' }

describe('sessionTokens', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('reads back what it wrote', () => {
    writeSessionTokens(tokens)

    expect(readSessionTokens()).toEqual(tokens)
  })

  it('stores the tokens in sessionStorage only', () => {
    writeSessionTokens(tokens)

    expect(window.sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKENS)).toContain('access-token')
    expect(window.localStorage).toHaveLength(0)
  })

  it('returns empty tokens when nothing is stored', () => {
    expect(readSessionTokens()).toEqual(EMPTY_SESSION_TOKENS)
  })

  it('fills in missing fields as null', () => {
    window.sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify({ idToken: 'id-token' }))

    expect(readSessionTokens()).toEqual({ ...EMPTY_SESSION_TOKENS, idToken: 'id-token' })
  })

  it('returns empty tokens when the stored value is not valid JSON', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    window.sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, '{broken')

    expect(readSessionTokens()).toEqual(EMPTY_SESSION_TOKENS)
    jest.restoreAllMocks()
  })

  it('removes the entry instead of storing all-empty tokens', () => {
    writeSessionTokens(tokens)

    writeSessionTokens(EMPTY_SESSION_TOKENS)

    expect(window.sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKENS)).toBeNull()
  })

  it('keeps the entry while at least one token is present', () => {
    writeSessionTokens({ ...EMPTY_SESSION_TOKENS, idToken: 'id-token' })

    expect(readSessionTokens().idToken).toBe('id-token')
  })

  it('clears the stored tokens', () => {
    writeSessionTokens(tokens)

    clearSessionTokens()

    expect(readSessionTokens()).toEqual(EMPTY_SESSION_TOKENS)
  })
})
