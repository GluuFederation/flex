import { handleResponse } from 'Utils/ApiUtils'

export default class ScimApi {
  constructor(api) {
    this.api = api
  }

  // Get SCIM Config
  getScimConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getScimConfig((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  // update SCIM Config
  updateScimConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.patchScimConfig({ requestBody: input }, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
