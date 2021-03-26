export default class InitApi {
  constructor(api) {
    this.api = api
  }

  // Get auth scripts
  getPersonScripts = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScripts((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
