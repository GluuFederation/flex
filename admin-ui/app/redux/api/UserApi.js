import { handleResponse } from 'Utils/ApiUtils'

export default class UserApi {
  constructor(api) {
    this.api = api
  }

  getUsers = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getUser(opts, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
