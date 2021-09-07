export default class MauApi {
  constructor(api) {
    this.api = api
  }

  // Get maximum actives users
  getMau = (opts) => {
    opts['format'] = 'json'
    return new Promise((resolve, reject) => {
      this.api.getStat(opts['month'], opts, (error, data) => {
        if (error) {
          console.log('=======Erroris :' + JSON.stringify(error))
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
