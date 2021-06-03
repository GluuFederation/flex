export default class ScopeApi {
  constructor(api) {
    this.api = api
  }

  getAllScopes = (options) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthScopes(options, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  getScope = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthScopesByInum(inum, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  getScope = async (id) => {
    return new Promise((resolve, reject) => {
      this.api.patchOauthScopesById(id, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  getScopeByOpts = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthScopes(opts, (error, data, response) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
  addNewScope = (input) => {
    return new Promise((resolve, reject) => {
      this.api.postOauthScopes(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  editAScope = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putOauthScopes(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  deleteAScope = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteOauthScopesByInum(inum, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
