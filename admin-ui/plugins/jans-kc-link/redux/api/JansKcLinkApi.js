import { handleResponse } from 'Utils/ApiUtils'

export default class JansKcLinkApi {
  constructor(api) {
    this.api = api
  }

  getKcLinkProperties = () => {
    return new Promise((resolve, reject) => {
      this.api.getKcLinkProperties((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  updateKcLinkConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putKcLinkProperties(input, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}