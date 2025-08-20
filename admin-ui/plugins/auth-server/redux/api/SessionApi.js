export default class SessionApi {
  constructor(api) {
    this.api = api
  }

  getAllSessions = () => {
    return new Promise((resolve, reject) => {
      this.api.getSessions((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  revokeSession = (userDn) => {
    return new Promise((resolve, reject) => {
      this.api.revokeUserSession(userDn, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  deleteSession = (sessionId) => {
    return new Promise((resolve, reject) => {
      this.api.deleteSession(sessionId, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  searchSession = (payload) => {
    return new Promise((resolve, reject) => {
      this.api.searchSession(payload.action, (error, data) => {
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
