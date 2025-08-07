import { handleResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'
import {
  CustomUser,
  UserPagedResult,
  GetUsersPayload,
  UserPatchRequest,
  User2FAPayload,
  FidoRegistrationEntry,
  IConfigurationUserManagementApi,
  UserModifyOptions,
  UserPatchOptions,
} from '../../types/UserApiTypes'

export default class UserApi {
  private api: IConfigurationUserManagementApi

  constructor(api: IConfigurationUserManagementApi) {
    this.api = api
  }

  getUsers = (payload: GetUsersPayload): Promise<UserPagedResult> => {
    return new Promise<UserPagedResult>((resolve, reject) => {
      this.api.getUser(payload.action, (error: Error | null, data?: UserPagedResult) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  createUsers = (data: CustomUser): Promise<CustomUser> => {
    const options: UserModifyOptions = {
      customUser: data,
    }
    return new Promise<CustomUser>((resolve, reject) => {
      this.api.postUser(options, (error: Error | null, data?: CustomUser) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  updateUsers = (data: CustomUser): Promise<CustomUser> => {
    const options: UserModifyOptions = {
      customUser: data,
    }
    return new Promise<CustomUser>((resolve, reject) => {
      this.api.putUser(options, (error: Error | null, data?: CustomUser) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  changeUserPassword = (data: UserPatchRequest & { inum: string }): Promise<CustomUser> => {
    const options: UserPatchOptions = {
      userPatchRequest: data,
    }
    return new Promise<CustomUser>((resolve, reject) => {
      this.api.patchUserByInum(data.inum, options, (error: Error | null, data?: CustomUser) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  deleteUser = (inum: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.api.deleteUser(inum, (error: Error | null, data?: unknown) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  /**
   * Get 2FA Details
   * @param payload - Object containing username and token
   * @returns Promise<FidoRegistrationEntry[]>
   */
  getUser2FADetails = (payload: User2FAPayload): Promise<FidoRegistrationEntry[]> => {
    return new Promise<FidoRegistrationEntry[]>((resolve, reject) => {
      axios
        .get(`/fido2/registration/entries/${payload.username}`, {
          headers: { Authorization: `Bearer ${payload.token}` },
        })
        .then((result) => handleResponse(null, reject, resolve as (data: unknown) => void, result))
        .catch((error) =>
          handleResponse(error, reject, resolve as (data: unknown) => void, undefined),
        )
    })
  }
}
