import { handleResponse } from 'Utils/ApiUtils'

export default class UserApi {
  constructor(api) {
    this.api = api
  }

  getUsers = (payload) => {
    return new Promise((resolve, reject) => {
<<<<<<< HEAD
      this.api.getUser({}, (error, data) => {
        handleResponse(error, reject, resolve, data)
=======
      this.api.getUser(payload.action, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
>>>>>>> main
      })
    })
  }
  createUsers = (data) => {
    // customUser
    const options = {}
    options['extendedCustomUser'] = data
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
}
