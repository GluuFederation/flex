import Axios, { AxiosRequestConfig, AxiosHeaders } from 'axios'
import store from './app/redux/store'

const baseUrl =
  (typeof window !== 'undefined' && (window as any).configApiBaseUrl) ||
  process.env.CONFIG_API_BASE_URL ||
  ''

export const AXIOS_INSTANCE = Axios.create({ baseURL: baseUrl, timeout: 60000 })

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const state = store.getState()
  const authState = (state as any)?.authReducer
  const issuer = authState?.issuer || null
  const userInum = authState?.userInum || ''
  const hasSession = authState?.hasSession || false

  config.withCredentials = hasSession

  if ((config.headers as any) && typeof (config.headers as any).set === 'function') {
    const headers = config.headers as unknown as AxiosHeaders
    if (issuer) headers.set('issuer', issuer)
    headers.set('jans-client', 'admin-ui')
    if (userInum) headers.set('User-inum', userInum)
  } else {
    config.headers = {
      ...(config.headers as any),
      ...(issuer ? { issuer } : {}),
      'jans-client': 'admin-ui',
      ...(userInum ? { 'User-inum': userInum } : {}),
    } as any
  }
  return config
})

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      window.location.href = '/admin/logout'
    }

    return Promise.reject(error)
  },
)

// React Query compatible instance
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: { signal?: AbortSignal },
): Promise<T> => {
  const source = Axios.CancelToken.source()

  const promise = AXIOS_INSTANCE({
    ...config,
    cancelToken: source.token,
    signal: options?.signal,
  }).then(({ data }) => data)

  // For React Query compatibility, we attach the cancel method to the promise
  ;(promise as any).cancel = () => {
    source.cancel('Operation canceled by the user.')
  }

  return promise
}
