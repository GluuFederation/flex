export default class HealthApi {
  constructor(api) {
    this.api = api
  }

  getHealthStatus = () => {
    return new Promise((resolve, reject) => {
      this.api.getAuthServerHealth((error, data) => {
        if (error) {
          console.log(e);
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
