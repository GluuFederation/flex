import store from 'Redux/store'
import { handleApiTimeout } from 'Redux/features/initSlice'
const MAX_RETRIES = 1;

export function handleResponse(error, reject, resolve, data, response) {
  if (error) {
    let combinedError = new Error(error.message);
    combinedError.error = error;
    if(response) {
      combinedError.api_response = response;
    }
    reject(combinedError)
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
