export default class AcrApi {
  constructor(api) {
    this.api = api
  }

  // Get Acrs Config
  getAcrsConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getAcrs((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // update Acrs Config
  updateAcrsConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putAcrs(input, (error, data) => {
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
