import { handleResponse } from 'Utils/ApiUtils'

export default class CacheRefreshApi {
  constructor(api) {
    this.api = api
  }

  getPropertiesCacheRefresh = () => {
    return new Promise((resolve, reject) => {
      this.api.getPropertiesCacheRefresh((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  updateCacheRefreshConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putPropertiesCacheRefresh(input, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}