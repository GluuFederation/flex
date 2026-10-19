import { AxiosHeaders, type AxiosError, type AxiosInstance } from 'axios'
import { AXIOS_INSTANCE, getApiToken } from './axiosInstance'
import backendAxios from '@/redux/api/axios'
import {
  API_PROTECTION_TOKEN_ENDPOINT,
  SESSION_ENDPOINT,
  createAdminUiSession,
} from '@/redux/api/backend-api'
import { clearApiToken, ensureApiToken } from '@/redux/api/apiToken'
import { handleSessionExpired } from '@/redux/features/initSlice'
import { logger } from '@/utils/logger'
import { getIssuer } from '@/utils/TokenController'
import type { RootState } from '@/redux/types'
import type { AppDispatch } from '@/redux/hooks'
import type { RetriableAxiosRequestConfig } from './types'

let installed = false
let sessionRecoveryPromise: Promise<boolean> | null = null

const SESSION_BOOTSTRAP_ENDPOINTS: readonly string[] = [
  SESSION_ENDPOINT,
  API_PROTECTION_TOKEN_ENDPOINT,
]

const isRecoverableBackendRequest = (url?: string): boolean =>
  Boolean(url?.startsWith('/')) && !SESSION_BOOTSTRAP_ENDPOINTS.includes(url ?? '')

const switchToSessionCookie = (request: RetriableAxiosRequestConfig): void => {
  const headers = AxiosHeaders.from(request.headers as AxiosHeaders)
  headers.delete('Authorization')
  request.headers = headers
  request.withCredentials = true
}

export const installInterceptors = (getState: () => RootState, dispatch: AppDispatch): void => {
  if (installed) return
  installed = true

  const getAuthSessionContext = () => {
    const state = getState()
    const authState = state.authReducer
    const issuer = authState?.issuer || getIssuer() || null
    const userInum = authState?.userInum || authState?.userinfo?.inum || ''
    const userJwt = authState?.userinfo_jwt || null
    const hasSession = authState?.hasSession || false
    const canAttemptSessionAuth = Boolean(issuer && userInum && userJwt)

    return { issuer, userInum, userJwt, hasSession, canAttemptSessionAuth }
  }

  const recoverAdminUiSession = async (): Promise<boolean> => {
    const { userJwt, canAttemptSessionAuth } = getAuthSessionContext()

    if (!canAttemptSessionAuth || !userJwt) {
      return false
    }

    if (!sessionRecoveryPromise) {
      sessionRecoveryPromise = (async () => {
        try {
          const response = await ensureApiToken(dispatch, { force: true, required: true })
          const apiProtectionToken = response?.access_token
          if (!apiProtectionToken) {
            return false
          }

          await createAdminUiSession(userJwt, apiProtectionToken)
          return true
        } catch (error) {
          logger.error(
            'Failed to recover Admin UI session:',
            error instanceof Error ? error : String(error),
          )
          return false
        } finally {
          sessionRecoveryPromise = null
        }
      })()
    }

    return sessionRecoveryPromise
  }

  const retryAfterSessionRecovery = async (
    instance: AxiosInstance,
    error: AxiosError,
    prepareRetry?: (request: RetriableAxiosRequestConfig) => void,
  ) => {
    const originalRequest = error.config as RetriableAxiosRequestConfig | undefined
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._sessionRetryAttempted
    ) {
      return null
    }

    originalRequest._sessionRetryAttempted = true
    clearApiToken()

    if (!(await recoverAdminUiSession())) return null
    prepareRetry?.(originalRequest)
    return instance(originalRequest)
  }

  AXIOS_INSTANCE.interceptors.request.use((config) => {
    const { issuer, userInum, hasSession, canAttemptSessionAuth } = getAuthSessionContext()
    const shouldSendSession = hasSession || canAttemptSessionAuth

    config.withCredentials = shouldSendSession

    if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers as Record<string, string>)
    }

    if (issuer) config.headers.set('issuer', issuer)
    config.headers.set('jans-client', 'admin-ui')
    if (userInum) config.headers.set('User-inum', userInum)

    const apiToken = getApiToken()
    if (shouldSendSession) {
      config.headers.delete('Authorization')
    } else if (apiToken) {
      config.headers.set('Authorization', `Bearer ${apiToken}`)
    }

    return config
  })

  AXIOS_INSTANCE.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const retried = await retryAfterSessionRecovery(AXIOS_INSTANCE, error)
      if (retried) return retried

      if (error.response?.status === 403) {
        dispatch(handleSessionExpired({ isSessionExpired: true }))
      }

      return Promise.reject(error)
    },
  )

  backendAxios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (isRecoverableBackendRequest(error.config?.url)) {
        const retried = await retryAfterSessionRecovery(backendAxios, error, switchToSessionCookie)
        if (retried) return retried
      }
      return Promise.reject(error)
    },
  )
}
