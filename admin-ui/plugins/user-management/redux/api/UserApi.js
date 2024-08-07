import { handleResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'
export default class UserApi {
  constructor(api) {
    this.api = api
  }

  getUsers = (payload) => {
    return new Promise((resolve, reject) => {
      this.api.getUser(payload.action, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
  createUsers = (data) => {
    // customUser
    const options = {}
    options['customUser'] = data
    return new Promise((resolve, reject) => {
      this.api.postUser(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
  updateUsers = (data) => {
    const options = {}
    options['customUser'] = data
    return new Promise((resolve, reject) => {
      this.api.putUser(options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  changeUserPassword = (data) => {
    const options = {}
    options['userPatchRequest'] = data
    return new Promise((resolve, reject) => {
      this.api.patchUserByInum(data.inum, options, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
  deleteUser = (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteUser(inum, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  /**
   * Get 2FA Details
   * @param {*} name 
   * @returns 
   */
  getUser2FADetails = (payload) => {
    return new Promise((resolve, reject) => {
      axios.get(`/fido2/registration/entries/${payload.username}`, { headers: { Authorization: `Bearer ${payload.token}` } })
      .then(result => handleResponse(undefined, reject, resolve, result))
      .catch(error => handleResponse(error, reject, resolve, undefined));
    })
  }
}
