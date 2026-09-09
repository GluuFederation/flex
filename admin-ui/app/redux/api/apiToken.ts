import { getApiToken, setApiToken } from 'Orval'
import { fetchApiTokenWithDefaultScopes } from './backend-api'
import { hasActiveSession } from './sessionState'
import { setApiDefaultToken, setBackendStatus } from '../features/authSlice'
import decodeJwt from '@/utils/jwtDecode'
import { logger } from '@/utils/logger'
import type { AppDispatch } from '../hooks'
import type { ApiTokenResponse } from './types/BackendApi'
import type { ApiErrorLike } from '../types/audit'

type EnsureApiTokenOptions = {
  force?: boolean
  required?: boolean
}

const EXPIRY_SKEW_MS = 30_000

let cachedToken: ApiTokenResponse | null = null
let cachedExpiryMs: number | null = null
let mintInFlight: Promise<ApiTokenResponse> | null = null

const readExpiryMs = (accessToken: string): number | null => {
  try {
    const { exp } = decodeJwt<{ exp?: number }>(accessToken)
    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

const toBackendStatus = (error: Error | ApiErrorLike) => {
  const err = error as ApiErrorLike
  const statusCode = typeof err?.response?.status === 'number' ? err.response.status : null
  const errorMessage =
    err?.response?.data?.responseMessage ??
    err?.response?.data?.message ??
    (error instanceof Error ? error.message : error != null ? String(error) : 'Network error')
  return { active: false as const, errorMessage, statusCode }
}

export const clearApiToken = (): void => {
  cachedToken = null
  cachedExpiryMs = null
  setApiToken(null)
}

const isCachedTokenUsable = (): boolean => {
  if (!cachedToken || !getApiToken()) return false
  if (cachedExpiryMs === null) return true
  return Date.now() + EXPIRY_SKEW_MS < cachedExpiryMs
}

const mintApiToken = (dispatch: AppDispatch): Promise<ApiTokenResponse> => {
  mintInFlight ??= (async () => {
    try {
      const token = await fetchApiTokenWithDefaultScopes()
      cachedToken = token
      cachedExpiryMs = readExpiryMs(token.access_token)
      setApiToken(token.access_token)
      dispatch(setApiDefaultToken(token))
      dispatch(setBackendStatus({ active: true, errorMessage: null, statusCode: null }))
      return token
    } catch (error) {
      clearApiToken()
      logger.error(
        'Failed to fetch API token with default scopes',
        error instanceof Error ? error : String(error),
      )
      dispatch(setBackendStatus(toBackendStatus(error as Error | ApiErrorLike)))
      throw error
    } finally {
      mintInFlight = null
    }
  })()

  return mintInFlight
}

export const ensureApiToken = async (
  dispatch: AppDispatch,
  { force = false, required = false }: EnsureApiTokenOptions = {},
): Promise<ApiTokenResponse | null> => {
  if (!force) {
    if (isCachedTokenUsable()) return cachedToken
    clearApiToken()
    if (!required && hasActiveSession()) return null
  }

  return mintApiToken(dispatch)
}
