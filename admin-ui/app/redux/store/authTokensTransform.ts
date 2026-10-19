import { createTransform } from 'redux-persist'
import { readSessionTokens, writeSessionTokens, type SessionTokens } from '@/utils/sessionTokens'
import type { AuthState } from '../features/types/authTypes'

type PersistedAuthState = Omit<AuthState, keyof SessionTokens>

export const authTokensTransform = createTransform<AuthState, PersistedAuthState>(
  ({ userinfo_jwt, idToken, jwtToken, ...persisted }) => {
    writeSessionTokens({ userinfo_jwt, idToken, jwtToken })
    return persisted
  },
  (persisted) => ({ ...(persisted as AuthState), ...readSessionTokens() }),
  { whitelist: ['authReducer'] },
)
