export default class MauApi {
  constructor(api) {
    this.api = api
  }
  getMau = (opts) => {
    opts['format'] = 'json'
    return new Promise((resolve, reject) => {
      console.log(opts)
      this.api.getStat('', opts, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
