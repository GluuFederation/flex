export default class CouchBaseApi {
  constructor(api) {
    this.api = api
  }

  // Get CouchBase Config
  getCouchBaseConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigDatabaseCouchbase((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // update CouchBase Config
  updateCouchBaseConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigDatabaseCouchbase(input, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // Add CouchBase Config
  addCouchBaseConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.postConfigDatabaseCouchbase(input, (error, data) => {
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
