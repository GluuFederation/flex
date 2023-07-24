import { handleResponse } from 'Utils/ApiUtils'

export default class CacheRefreshApi {
  constructor(api) {
    this.api = api
  }

  getPropertiesCacheRefresh = () => {
    return new Promise((resolve, reject) => {
      this.api.getJansLinkProperties((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  updateCacheRefreshConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putJansLinkProperties(input, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}