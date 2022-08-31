import { handleResponse } from 'Utils/ApiUtils'

export default class OIDCApi {
  constructor(api) {
    this.api = api
  }

  getAllOpenidClients = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthOpenidClients(opts, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  addNewOpenIdClient = (data) => {
    return new Promise((resolve, reject) => {
      this.api.postOauthOpenidClients(data, (error, res) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  editAClient = (data) => {
    return new Promise((resolve, reject) => {
      this.api.putOauthOpenidClients(data, (error, res) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  deleteAClient = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteOauthOpenidClientsByInum(inum, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
