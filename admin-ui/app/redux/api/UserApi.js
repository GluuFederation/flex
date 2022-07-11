export default class UserApi {
  constructor(api) {
    this.api = api
  }

  getUsers = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getUser(opts, (error, data) => {
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
