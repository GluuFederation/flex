export default class JwksApi {
  constructor(api) {
    this.api = api
  }
  // get jwks Config
  getJwks = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigJwks((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
