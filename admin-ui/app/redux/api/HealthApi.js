import { handleResponse } from 'Utils/ApiUtils'

export default class HealthApi {
  constructor(api) {
    this.api = api
  }

  getHealthStatus = () => {
    return new Promise((resolve, reject) => {
      this.api.getAuthServerHealth((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
