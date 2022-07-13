export default class StatApi {
  constructor(api) {
    this.api = api
  }

  getStat = (opts) => {
    console.log('OPTS', opts)
    return new Promise((resolve, reject) => {
      this.api.getServerStat(opts, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  handleResponse(error, reject, resolve, data) {
    if (error) {
      reject(error)
    } else {
      resolve(data)
    }
  }
}
