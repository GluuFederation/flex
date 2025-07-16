import { handleResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'

// Type definitions for API structures
interface CustomUser {
  userId?: string
  mail?: string
  displayName?: string
  status?: string
  userPassword?: string
  givenName?: string
  customAttributes?: CustomAttribute[]
  inum?: string
  dn?: string
  [key: string]: any
}

interface CustomAttribute {
  name: string
  multiValued: boolean
  values?: string[]
}

interface UserAction {
  action?: string
  limit?: number
  pattern?: string
  startIndex?: number
  [key: string]: any
}

interface UserPatchRequest {
  inum: string
  jsonPatchString?: string
  customAttributes?: CustomAttribute[]
  [key: string]: any
}

interface User2FAPayload {
  username: string
  token: string
}

interface ApiCallback<T> {
  (error: Error | null, data?: T): void
}

interface UserApiInstance {
  getUser(payload: UserAction, callback: ApiCallback<any>): void
  postUser(options: { customUser: CustomUser }, callback: ApiCallback<any>): void
  putUser(options: { customUser: CustomUser }, callback: ApiCallback<any>): void
  patchUserByInum(
    inum: string,
    options: { userPatchRequest: UserPatchRequest },
    callback: ApiCallback<any>,
  ): void
  deleteUser(inum: string, callback: ApiCallback<any>): void
}

export default class UserApi {
  private api: UserApiInstance

  constructor(api: UserApiInstance) {
    this.api = api
  }

  getUsers = (payload: UserAction): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.getUser(payload, (error: Error | null, data?: any) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  createUsers = (data: CustomUser): Promise<any> => {
    // customUser
    const options: { customUser: CustomUser } = { customUser: data }
    return new Promise((resolve, reject) => {
      this.api.postUser(options, (error: Error | null, data?: any) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  updateUsers = (data: CustomUser): Promise<any> => {
    const options: { customUser: CustomUser } = { customUser: data }
    return new Promise((resolve, reject) => {
      this.api.putUser(options, (error: Error | null, data?: any) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  changeUserPassword = (data: UserPatchRequest): Promise<any> => {
    const options: { userPatchRequest: UserPatchRequest } = { userPatchRequest: data }
    return new Promise((resolve, reject) => {
      this.api.patchUserByInum(data.inum, options, (error: Error | null, data?: any) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  deleteUser = (inum: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.api.deleteUser(inum, (error: Error | null, data?: any) => {
        handleResponse(error, reject, resolve, data, undefined)
      })
    })
  }

  /**
   * Get 2FA Details
   * @param payload - Contains username and token
   * @returns Promise with 2FA details
   */
  getUser2FADetails = (payload: User2FAPayload): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/fido2/registration/entries/${payload.username}`, {
          headers: { Authorization: `Bearer ${payload.token}` },
        })
        .then((result) => handleResponse(null, reject, resolve, result, result))
        .catch((error) => handleResponse(error, reject, resolve, undefined, undefined))
    })
  }
}
