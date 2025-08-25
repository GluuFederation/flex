import { handleResponse } from 'Utils/ApiUtils'

export default class ScriptApi {
  constructor(api) {
    this.api = api
  }

  // Get all scripts
  getAllScripts = (options = {}) => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScripts(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  // Get scripts by type
  getScriptsByType = (scriptType, options = {}) => {
    return new Promise((resolve, reject) => {
      // Use fieldValuePair to filter by scriptType
      const searchOptions = {
        ...options,
        fieldValuePair: `scriptType:${scriptType}`,
      }
      this.api.getConfigScripts(searchOptions, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  // Get script by inum
  getScript = (inum) => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScriptsByInum(inum, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  // Add new script
  addScript = (data) => {
    return new Promise((resolve, reject) => {
      this.api.postConfigScripts({ customScript: data }, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  // Update script
  updateScript = (data) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigScripts({ customScript: data }, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  // Delete script
  deleteScript = (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteConfigScriptsByInum(inum, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}
