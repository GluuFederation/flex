import Axios, { AxiosRequestConfig } from 'axios'
import { resolveConfigApiBaseUrl } from '@/utils/configApiBaseUrl'
import type { CancellablePromise } from './types'

const baseUrl = resolveConfigApiBaseUrl('')

export const AXIOS_INSTANCE = Axios.create({ baseURL: baseUrl, timeout: 60000 })

let apiToken: string | null = null

export const setApiToken = (token: string | null): void => {
  apiToken = token
}

export const getApiToken = (): string | null => apiToken

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
