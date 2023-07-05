import store from 'Redux/store'
import { handleApiTimeout } from 'Redux/features/initSlice'

export function handleResponse(error, reject, resolve, data) {
  if (error) {
    reject(error)
    if(error?.message?.toLocaleLowerCase()?.includes('timeout')) {
      store.dispatch(handleApiTimeout({ isTimeout: true }))
    }
  } else {
    resolve(data)
  }
}
