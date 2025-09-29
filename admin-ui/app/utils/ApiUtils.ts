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
    // For void responses, undefined data is valid and should resolve successfully
    // We can check this by attempting to resolve with undefined cast as T
    // This works because for void types, undefined is a valid value
    resolve(undefined as T)
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
