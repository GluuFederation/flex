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
      this.api.putConfigDatabaseSql(input.sql, (error, data) => {
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
    alert(JSON.stringify(input.sql))
    return new Promise((resolve, reject) => {
      this.api.postConfigDatabaseSql(input.sql, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

    // delete Ldap Config
    deleteSqlConfig = (input) => {
      return new Promise((resolve, reject) => {
        this.api.deleteConfigDatabaseSqlByName(input, (error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(data)
          }
        })
      })
    }
  
    // test LDAP Config
    testLdapConfig = (input) => {
      console.log('Sql Api testSqlConfig  ')
      return new Promise((resolve, reject) => {
        this.api.postConfigDatabaseSqlTest(input, (error, data, response) => {
          if (error) {
            reject(error)
          } else {
            console.log('SQL Api testSqlConfig  data =' + JSON.stringify(data))
            resolve(data)
          }
        })
      })
    }
}
