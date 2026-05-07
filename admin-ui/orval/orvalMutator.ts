import Axios, { AxiosHeaders, AxiosRequestConfig } from 'axios'
import { getRootState } from '@/redux/hooks'
import {
  fetchApiTokenWithDefaultScopes,
  deleteAdminUiSession,
  createAdminUiSession,
} from '@/redux/api/backend-api'
import { REGEX_PYTHON_PLACEHOLDER } from '@/utils/regex'
import { devLogger } from '@/utils/devLogger'
import { ROUTES } from '@/helpers/navigation'
import { getIssuer } from '@/utils/TokenController'

type CancellablePromise<T> = Promise<T> & { cancel?: () => void }
type RetriableAxiosRequestConfig = AxiosRequestConfig & { _sessionRetryAttempted?: boolean }

const windowUrl =
  typeof window !== 'undefined' &&
  window.configApiBaseUrl &&
  !REGEX_PYTHON_PLACEHOLDER.test(window.configApiBaseUrl)
    ? window.configApiBaseUrl
    : undefined

const baseUrl = windowUrl || process.env.CONFIG_API_BASE_URL || ''

export const AXIOS_INSTANCE = Axios.create({ baseURL: baseUrl, timeout: 60000 })

let sessionRecoveryPromise: Promise<boolean> | null = null

const getAuthSessionContext = () => {
  const state = getRootState()
  const authState = state.authReducer
  const issuer = authState?.issuer || getIssuer() || null
  const userInum = authState?.userInum || authState?.userinfo?.inum || ''
  const userJwt = authState?.userinfo_jwt || null
  const hasSession = authState?.hasSession || false
  const canAttemptSessionAuth = Boolean(issuer && userInum && userJwt)

  return {
    issuer,
    userInum,
    userJwt,
    hasSession,
    canAttemptSessionAuth,
  }
}

const recoverAdminUiSession = async (): Promise<boolean> => {
  const { userJwt, canAttemptSessionAuth } = getAuthSessionContext()

  if (!canAttemptSessionAuth || !userJwt) {
    return false
  }

  if (!sessionRecoveryPromise) {
    sessionRecoveryPromise = (async () => {
      try {
        const response = await fetchApiTokenWithDefaultScopes()
        const apiProtectionToken = response?.access_token
        if (!apiProtectionToken) {
          return false
        }

        await createAdminUiSession(userJwt, apiProtectionToken)
        return true
      } catch (error) {
        devLogger.error(
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

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const { issuer, userInum, hasSession, canAttemptSessionAuth } = getAuthSessionContext()
  const shouldSendSession = hasSession || canAttemptSessionAuth

  config.withCredentials = shouldSendSession

  if (config.headers instanceof AxiosHeaders) {
    if (issuer) config.headers.set('issuer', issuer)
    config.headers.set('jans-client', 'admin-ui')
    if (userInum) config.headers.set('User-inum', userInum)
  } else {
    config.headers = new AxiosHeaders({
      ...(config.headers as Record<string, string>),
      ...(issuer ? { issuer } : {}),
      'jans-client': 'admin-ui',
      ...(userInum ? { 'User-inum': userInum } : {}),
    })
  }

  return config
})

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetriableAxiosRequestConfig | undefined

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._sessionRetryAttempted
    ) {
      originalRequest._sessionRetryAttempted = true

      const sessionRecovered = await recoverAdminUiSession()
      if (sessionRecovered) {
        return AXIOS_INSTANCE(originalRequest)
      }
    }

    if (error.response?.status === 403) {
      try {
        const response = await fetchApiTokenWithDefaultScopes()
        await deleteAdminUiSession(response?.access_token)
      } catch (e) {
        devLogger.error('Failed to cleanup session on 403:', e instanceof Error ? e : String(e))
      } finally {
        window.location.href = ROUTES.LOGOUT
      }
    }

    return Promise.reject(error)
  },
)

export const setApiToken = (token: string | null): void => {
  if (token) {
    AXIOS_INSTANCE.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete (AXIOS_INSTANCE.defaults.headers.common as Record<string, string>)['Authorization']
  }
}

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: { signal?: AbortSignal },
): Promise<T> => {
  const source = Axios.CancelToken.source()

  const promise: CancellablePromise<T> = AXIOS_INSTANCE({
    ...config,
    cancelToken: source.token,
    signal: options?.signal,
  }).then(({ data }) => data)

  promise.cancel = () => {
    source.cancel('Operation canceled by the user.')
  }

  return promise
}
