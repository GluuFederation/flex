import { handleResponse } from 'Utils/ApiUtils'

export default class JsonConfigApi {
  constructor(api) {
    this.api = api
  }

  // Get json Config
  fetchJsonConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getProperties((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
  // patch json Config
  patchJsonConfig = (options) => {
    return new Promise((resolve, reject) => {
      this.api.patchProperties(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
