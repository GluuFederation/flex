export default class UserApi {
  constructor(api) {
    this.api = api
  }
  getUsers = () => {
    return new Promise((resolve, reject) => {
      this.api.getScimUsers((error, data) => {
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
