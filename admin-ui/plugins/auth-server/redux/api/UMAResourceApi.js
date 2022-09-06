import { handleResponse } from 'Utils/ApiUtils'

export default class UMAResourceApi {
  constructor(api) {
    this.api = api
  }

  getUMAResources = async (clientId) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthUmaResourcesByClientid(clientId, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  deteleUMAResource = async (id) => {
    return new Promise((resolve, reject) => {
      this.api.deleteOauthUmaResourcesById(id, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
