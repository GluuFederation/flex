import Axios, { AxiosRequestConfig, AxiosHeaders } from 'axios'

const baseUrl =
  (typeof window !== 'undefined' && (window as any).configApiBaseUrl) ||
  process.env.CONFIG_API_BASE_URL ||
  ''

export const AXIOS_INSTANCE = Axios.create({ baseURL: baseUrl, timeout: 60000 })

AXIOS_INSTANCE.interceptors.request.use((config) => {
  let token: string | null = null
  let issuer: string | null = null

  if (typeof window !== 'undefined' && window.localStorage) {
    token = window.localStorage.getItem('gluu.api.token')
    issuer =
      window.localStorage.getItem('gluu.api.token.issuer') || window.localStorage.getItem('issuer')
  }

  if ((config.headers as any) && typeof (config.headers as any).set === 'function') {
    const headers = config.headers as unknown as AxiosHeaders
    if (token) headers.set('Authorization', `Bearer ${token}`)
    if (issuer) headers.set('issuer', issuer)
  } else {
    config.headers = {
      ...(config.headers as any),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(issuer ? { issuer } : {}),
    } as any
  }
  return config
})

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
