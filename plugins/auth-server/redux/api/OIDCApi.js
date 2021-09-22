export default class OIDCApi {
  constructor(api) {
    this.api = api
  }

  getAllOpenidClients = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthOpenidClients(opts, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  addNewOpenIdClient = (data) => {
    return new Promise((resolve, reject) => {
      this.api.postOauthOpenidClients(data, (error, res) => {
        if (error) {
          reject(error)
        } else {
          resolve(res)
        }
      })
    })
  }

  editAClient = (data) => {
    return new Promise((resolve, reject) => {
      this.api.putOauthOpenidClients(data, (error, res) => {
        if (error) {
          reject(error)
          console.log('===========' + JSON.stringify(error))
        } else {
          resolve(res)
        }
      })
    })
  }

  deleteAClient = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteOauthOpenidClientsByInum(inum, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
