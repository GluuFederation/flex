export default class HealthApi {
  constructor(api) {
    this.api = api
  }

  // Get maximum actives users
  getHealthStatus = (opts) => {
    opts['format'] = 'json'
    return new Promise((resolve, reject) => {
      this.api.getConfigHealthReady( (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
