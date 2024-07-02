import { handleResponse } from 'Utils/ApiUtils'

export default class JansKcLinkApi {
  constructor(api) {
    this.api = api
  }

  getLockProperties = () => {
    return new Promise((resolve, reject) => {
      this.api.getLockProperties((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  updateKcLinkConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.patchLockProperties({ requestBody: input }, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
