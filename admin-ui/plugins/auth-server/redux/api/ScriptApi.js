import { handleResponse } from 'Utils/ApiUtils'

export default class ScriptApi {
  constructor(api) {
    this.api = api
  }

  getAllScripts = (options = {}) => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScripts(options, (error, data, response) => {
        handleResponse(error, reject, resolve, data, response)
      })
    })
  }

  getScriptsByType = (scriptType, options = {}) => {
    return new Promise((resolve, reject) => {
      const searchOptions = {
        ...options,
        ...(scriptType
          ? { fieldValuePair: options.fieldValuePair || `scriptType:${scriptType}` }
          : {}),
      }
      this.api.getConfigScripts(searchOptions, (error, data, response) => {
        handleResponse(error, reject, resolve, data, response)
      })
    })
  }

  getScript = (inum) => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScriptsByInum(inum, (error, data, response) => {
        handleResponse(error, reject, resolve, data, response)
      })
    })
  }

  addScript = (data) => {
    return new Promise((resolve, reject) => {
      this.api.postConfigScripts({ customScript: data }, (error, data, response) => {
        handleResponse(error, reject, resolve, data, response)
      })
    })
  }

  updateScript = (data) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigScripts({ customScript: data }, (error, data, response) => {
        handleResponse(error, reject, resolve, data, response)
      })
    })
  }

  deleteScript = (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteConfigScriptsByInum(inum, (error, data, response) => {
        handleResponse(error, reject, resolve, data, response)
      })
    })
  }
}
