export default class LdapApi {
  constructor(api) {
    this.api = api
  }

  // Get Ldap Config
  getLdapConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigDatabaseLdap((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // update Ldap Config
  updateLdapConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigDatabaseLdap(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // Add Ldap Config
  addLdapConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.postConfigDatabaseLdap(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // delete Ldap Config
  deleteLdapConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.deleteConfigDatabaseLdapByName(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

}
