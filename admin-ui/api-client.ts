import Axios, { AxiosRequestConfig, AxiosHeaders } from 'axios'
import { getRootState } from './app/redux/hooks'
import { fetchApiTokenWithDefaultScopes, deleteAdminUiSession } from './app/redux/api/backend-api'
import type { CancellablePromise } from './app/redux/types'

const baseUrl =
  (typeof window !== 'undefined' && window.configApiBaseUrl) ||
  process.env.CONFIG_API_BASE_URL ||
  ''

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
        window.location.href = '/admin/logout'
      } catch (e) {
        console.error('Failed to cleanup session on 403:', e)
      }
    }

    return Promise.reject(error)
  },
)

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
