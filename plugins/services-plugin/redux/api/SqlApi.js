export default class SqlApi {
  constructor(api) {
    this.api = api
  }

  // Get Sql Config
  getSqlConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigDatabaseSql((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // update Sql Config
  updateSqlConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigDatabaseSql(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // Add Sql Config
  addSqlConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.postConfigDatabaseSql(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}
