import { handleResponse } from 'Utils/ApiUtils'

export default class ConfigurationApi {
  constructor(api) {
    this.api = api
  }

  getConfigApiConfiguration = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigApiProperties((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  patchApiConfigConfiguration = (options) => {
    return new Promise((resolve, reject) => {
      this.api.patchConfigApiProperties(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
