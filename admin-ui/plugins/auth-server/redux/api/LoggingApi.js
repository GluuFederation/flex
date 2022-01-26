export default class LoggingApi {
  constructor(api) {
    this.api = api
  }

  // get logging Config
  getLoggingConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigLogging((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // update logging Config
  editLoggingConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigLogging(input, (error, data) => {
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
