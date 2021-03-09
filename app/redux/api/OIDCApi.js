export default class OIDCApi {
  constructor(api) {
    this.api = api
  }

  getAllOpenidClients = () => {
    return new Promise((resolve, reject) => {
      this.api.getOauthOpenidClients({}, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
