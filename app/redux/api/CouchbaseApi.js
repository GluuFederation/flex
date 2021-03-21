export default class CouchBaseApi {
  constructor(api) {
    this.api = api
  }

  // Get CouchBase Config
  getCouchBaseConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigDatabaseCouchbase((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // update CouchBase Config
  updateCouchBaseConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigDatabaseCouchbase(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // Add CouchBase Config
  addCouchBaseConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.postConfigDatabaseCouchbase(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  
}
