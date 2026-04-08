import store from 'Redux/store'
import { handleApiTimeout } from 'Redux/features/initSlice'

export const handleResponse = <T>(
  error: Error | null,
  reject: (error: Error) => void,
  resolve: (data: T) => void,
  data: T,
): void => {
  if (error) {
    reject(error)
    if (error?.message?.toLocaleLowerCase()?.includes('timeout')) {
      store.dispatch(handleApiTimeout({ isTimeout: true }))
    }
  } else {
    resolve(data)
  }
}

export const handleTypedResponse = <T>(
  error: Error | null,
  reject: (error: Error) => void,
  resolve: (data: T) => void,
  data: T | undefined,
): void => {
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

export const handleError = (error: Error | null, reject: (error: Error) => void): void => {
  if (error) {
    reject(error)
    if (error?.message?.toLocaleLowerCase()?.includes('timeout')) {
      store.dispatch(handleApiTimeout({ isTimeout: true }))
    }
  }
}

export const handleSuccess = <T>(data: T, resolve: (data: T) => void): void => {
  resolve(data)
}
