export default class JsonConfigApi {
  constructor(api) {
    this.api = api
  }

  // Get json Config
  fetchJsonConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getProperties((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
  // patch json Config
  patchJsonConfig = (options) => {
    return new Promise((resolve, reject) => {
      this.api.patchProperties(options, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
