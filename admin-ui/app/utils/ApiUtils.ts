import store from 'Redux/store'
import { handleApiTimeout } from 'Redux/features/initSlice'
const MAX_RETRIES = 1

export function handleResponse(
  error: Error | null,
  reject: (error: Error) => void,
  resolve: (data: unknown) => void,
  data: unknown,
  response?: unknown,
): void {
  if (error) {
    reject(error)
    if (error?.message?.toLocaleLowerCase()?.includes('timeout')) {
      store.dispatch(handleApiTimeout({ isTimeout: true }))
    }
  } else {
    resolve(data)
  }
}

export function handleResponseTyped<T>(
  error: Error | null,
  reject: (error: Error) => void,
  resolve: (data: T) => void,
  data: T,
  response?: unknown,
): void {
  if (error) {
    reject(error)
    if (error?.message?.toLocaleLowerCase()?.includes('timeout')) {
      store.dispatch(handleApiTimeout({ isTimeout: true }))
    }
  } else {
    resolve(data)
  }
}

export function handleError(error: Error | null, reject: (error: Error) => void): void {
  if (error) {
    reject(error)
    if (error?.message?.toLocaleLowerCase()?.includes('timeout')) {
      store.dispatch(handleApiTimeout({ isTimeout: true }))
    }
  }
}

export function handleSuccess(data: unknown, resolve: (data: unknown) => void): void {
  resolve(data)
}
