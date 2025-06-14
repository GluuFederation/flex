export default class PersistenceConfigApi {
  constructor(api) {
    this.api = api
  }

  // Get json Config
  getPersistenceType = () => {
    return new Promise((resolve, reject) => {
      this.api.getPropertiesPersistence((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // Get database information
  getDatabaseInfo = () => {
    return new Promise((resolve, reject) => {
      this.api.getDatabaseInfo((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
