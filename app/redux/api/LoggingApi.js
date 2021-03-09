export default class LoggingApi {
  constructor(api) {
    this.api = api
  }

  // get logging Config
  getLoggingConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigLogging((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // update logging Config
  editLoggingConfig = (input) => {
    console.log('***********************' + input)
    return new Promise((resolve, reject) => {
      this.api.putConfigLogging(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
