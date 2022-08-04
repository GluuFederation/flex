export default class UMAResourcesApi {
  constructor(api) {
    this.api = api
  }

  getUmaResources = async (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthUmaResources(opts, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  handleResponse(error, reject, resolve, data) {
    if (error) {
      reject(error)
    } else {
      resolve(data)
    }
  }
}
