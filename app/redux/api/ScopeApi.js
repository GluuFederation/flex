export default class ScopeApi {
  constructor(api) {
    this.api = api
  }

  // Get All scopes
  getAllScopes = () => {
    return new Promise((resolve, reject) => {
      this.api.getOauthScopes({}, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // Get scope by inum
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

  // Delete existing scope
  deleteScope = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteOauthScopesById(inum, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
