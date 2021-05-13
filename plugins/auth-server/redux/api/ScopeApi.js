export default class ScopeApi {
  constructor(api) {
    this.api = api
  }

  // Get All scopes
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

  // Get scope by id
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

  s // Get scope by pattern
  getScopeByOpts = (opts) => {
    console.log(
      '\n\n\n ********************************** Scope Api getScopeByOpts opts=' +
        opts +
        '\n\n\n',
    )
    return new Promise((resolve, reject) => {
      this.api.getOauthScopes(opts, (error, data, response) => {
        if (error) {
          console.log('Scope Api getScopeByOpts error =' + error)
          reject(error)
        } else {
          console.log(
            '**********************************  Scope Api getScopeByOpts data =' +
              data,
          )
          resolve(data)
        }
      })
    })
  }

  //Add Scope Config
  addNewScope = (input) => {
    console.log('Scope Api Class add data =' + JSON.stringify(input))
    return new Promise((resolve, reject) => {
      this.api.postOauthScopes(input, (error, data) => {
        if (error) {
          console.log('Scope Api add error =' + error)
          reject(error)
        } else {
          console.log('Scope Api add response =' + data)
          resolve(data)
        }
      })
    })
  }

  editAScope = (input) => {
    console.log('Scope Api editAScope data =' + JSON.stringify(input))
    return new Promise((resolve, reject) => {
      this.api.putOauthScopes(input, (error, data) => {
        if (error) {
          console.log('Scope Api editAScope error =' + error)
          reject(error)
        } else {
          console.log('Scope Api editAScope response =' + data)
          resolve(data)
        }
      })
    })
  }

  // Delete existing scope
  deleteAScope = async (inum) => {
    console.log('Scope Api deleteAScope inum =' + JSON.stringify(inum))
    return new Promise((resolve, reject) => {
      this.api.deleteOauthScopesByInum(inum, (error, data) => {
        if (error) {
          console.log('Scope Api deleteAScope error =' + error)
          reject(error)
        } else {
          console.log('Scope Api deleteAScope response =' + data)
          resolve(data)
        }
      })
    })
  }
}
