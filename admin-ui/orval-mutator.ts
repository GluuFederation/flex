import Axios, { AxiosHeaders, AxiosRequestConfig } from 'axios'
import { getRootState } from './app/redux/hooks'
import { fetchApiTokenWithDefaultScopes, deleteAdminUiSession } from './app/redux/api/backend-api'
import { REGEX_PYTHON_PLACEHOLDER } from '@/utils/regex'
import { devLogger } from './app/utils/devLogger'
import { ROUTES } from './app/helpers/navigation'

type CancellablePromise<T> = Promise<T> & { cancel?: () => void }

const windowUrl =
  typeof window !== 'undefined' &&
  window.configApiBaseUrl &&
  !REGEX_PYTHON_PLACEHOLDER.test(window.configApiBaseUrl)
    ? window.configApiBaseUrl
    : undefined

const baseUrl = windowUrl || process.env.CONFIG_API_BASE_URL || ''

export const AXIOS_INSTANCE = Axios.create({ baseURL: baseUrl, timeout: 60000 })

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const state = getRootState()
  const authState = state.authReducer
  const issuer = authState?.issuer || null
  const userInum = authState?.userInum || ''
  const hasSession = authState?.hasSession || false

  config.withCredentials = hasSession

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
