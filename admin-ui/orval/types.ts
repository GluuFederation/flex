import type { AxiosRequestConfig } from 'axios'

export type CancellablePromise<T> = Promise<T> & { cancel?: () => void }

export type RetriableAxiosRequestConfig = AxiosRequestConfig & {
  _sessionRetryAttempted?: boolean
}
