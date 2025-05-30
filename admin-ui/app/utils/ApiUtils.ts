// @ts-nocheck
import store from 'Redux/store'
import { handleApiTimeout } from 'Redux/features/initSlice'
const MAX_RETRIES = 1;

export function handleResponse(error, reject, resolve, data, response) {
  if (error) {
    reject(error)
    if (error?.message?.toLocaleLowerCase()?.includes('timeout')) {
      store.dispatch(handleApiTimeout({ isTimeout: true }))
    }
  } else {
    resolve(data)
  }
}


export function handleError(error, reject) {
  if (error) {
    reject(error)
    if (error?.message?.toLocaleLowerCase()?.includes('timeout')) {
      store.dispatch(handleApiTimeout({ isTimeout: true }))
    }
  }
}

export function handleSuccess(data, resolve) {
  resolve(data)
}
