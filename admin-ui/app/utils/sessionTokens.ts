import { STORAGE_KEYS } from '@/constants'
import { sessionStore } from '@/utils/storage'
import type { AuthState } from '@/redux/features/types/authTypes'

const SESSION_TOKEN_FIELDS = ['userinfo_jwt', 'idToken', 'jwtToken'] as const

export type SessionTokens = Pick<AuthState, (typeof SESSION_TOKEN_FIELDS)[number]>

export const EMPTY_SESSION_TOKENS: SessionTokens = {
  userinfo_jwt: null,
  idToken: null,
  jwtToken: null,
}

export const readSessionTokens = (): SessionTokens => ({
  ...EMPTY_SESSION_TOKENS,
  ...sessionStore.getJSON<Partial<SessionTokens>>(STORAGE_KEYS.AUTH_TOKENS),
})

export const clearSessionTokens = (): void => sessionStore.remove(STORAGE_KEYS.AUTH_TOKENS)

export const writeSessionTokens = (tokens: SessionTokens): void => {
  if (SESSION_TOKEN_FIELDS.every((field) => !tokens[field])) {
    clearSessionTokens()
    return
  }
  sessionStore.setJSON(STORAGE_KEYS.AUTH_TOKENS, tokens)
}
