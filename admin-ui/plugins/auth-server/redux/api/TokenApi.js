import { handleResponse } from 'Utils/ApiUtils'

export default class TokenApi {
  constructor(api) {
    this.api = api
  }

  getOpenidClientTokens = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getTokenByClient(opts, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

}
