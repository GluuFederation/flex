export default class MauApi {
  constructor(api) {
    this.api = api
  }

  // Get maximum actives users
  getMau = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getStat(opts['month'], opts, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
