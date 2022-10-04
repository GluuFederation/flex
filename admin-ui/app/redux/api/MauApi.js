import { handleResponse } from 'Utils/ApiUtils'

export default class MauApi {
  constructor(api) {
    this.api = api
  }
  getMau = (opts) => {
    opts['format'] = 'json'
    return new Promise((resolve, reject) => {
      this.api.getStat(opts, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
