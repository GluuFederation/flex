import Axios, { AxiosRequestConfig } from 'axios'
import { REGEX_PYTHON_PLACEHOLDER } from '@/utils/regex'
import type { CancellablePromise } from './types'

const windowUrl =
  typeof window !== 'undefined' &&
  window.configApiBaseUrl &&
  !REGEX_PYTHON_PLACEHOLDER.test(window.configApiBaseUrl)
    ? window.configApiBaseUrl
    : undefined

const baseUrl = windowUrl || process.env.CONFIG_API_BASE_URL || ''

export const AXIOS_INSTANCE = Axios.create({ baseURL: baseUrl, timeout: 60000 })

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
