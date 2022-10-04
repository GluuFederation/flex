import { handleResponse } from 'Utils/ApiUtils'

export default class ScopeApi {
  constructor(api) {
    this.api = api
  }

  getAllScopes = (options) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthScopes(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  getScope = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthScopesByInum(inum, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
  getScopeByCreator = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.getScopeByCreator(inum, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  patchScope = async (id) => {
    return new Promise((resolve, reject) => {
      this.api.patchOauthScopesById(id, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  getScopeByOpts = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getOauthScopes(opts, (error, data, response) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
  addNewScope = (input) => {
    return new Promise((resolve, reject) => {
      this.api.postOauthScopes(input, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  editAScope = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putOauthScopes(input, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  deleteAScope = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteOauthScopesByInum(inum, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
