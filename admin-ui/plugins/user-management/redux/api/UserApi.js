export default class UserApi {
  constructor(api) {
    this.api = api
  }

  getUsers = () => {
    return new Promise((resolve, reject) => {
      this.api.getUser({}, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }
  createUsers = (data) => {
    // customUser
    const options = {}
    options['extendedCustomUser'] = data
    return new Promise((resolve, reject) => {
      this.api.postUser(options, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }
  updateUsers = (data) => {
    // customUser

    //CODE WITH PUT
    const options = {}
    options['customUser'] = data
    return new Promise((resolve, reject) => {
      this.api.putUser(options, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })

    //Code with PATCH
    // const options = {}
    // options['userPatchRequest'] = data
    // return new Promise((resolve, reject) => {
    //   this.api.patchUserByInum(data.inum, options, (error, data) => {
    //     this.handleResponse(error, reject, resolve, data)
    //   })
    // })
  }
  deleteUser = (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteUser(inum, (error, data) => {
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
