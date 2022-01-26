export default class ScriptApi {
  constructor(api) {
    this.api = api
  }
  getAllCustomScript = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScripts((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }
  getScriptsByType = (options) => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScriptsByType(
        options['type'],
        options,
        (error, data) => {
          this.handleResponse(error, reject, resolve, data)
        },
      )
    })
  }

  addCustomScript = (data) => {
    return new Promise((resolve, reject) => {
      this.api.postConfigScripts(data, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  editCustomScript = (data) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigScripts(data, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  getCustomScript = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScriptsByInum(inum, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  getCustomScriptByType = async (type) => {
    return new Promise((resolve, reject) => {
      this.api.getConfigScriptsByType(type, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  deleteCustomScript = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteConfigScriptsByInum(inum, (error, data) => {
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
