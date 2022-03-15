import {
  UM_GET_USERS,
  UM_UPDATE_USERS_RESPONSE,
  UM_UPDATE_LOADING,
} from './types'

export const getUsers = (action) => ({
  type: UM_GET_USERS,
  payload: { action },
})

export const updateUserResponse = (action) => ({
  type: UM_UPDATE_USERS_RESPONSE,
  payload: { action },
})
export const UMupdateUserLoading = (action) => ({
  type: UM_UPDATE_LOADING,
  payload: action,
})
