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

// Generic version that preserves type safety
export function handleTypedResponse<T>(
  error: Error | null,
  reject: (error: Error) => void,
  resolve: (data: T) => void,
  data: T | undefined,
  response?: unknown,
): void {
  if (error) {
    reject(error)
    if (error?.message?.toLocaleLowerCase()?.includes('timeout')) {
      store.dispatch(handleApiTimeout({ isTimeout: true }))
    }
  } else if (data !== undefined) {
    resolve(data)
  } else {
    reject(new Error('No data received from API'))
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
