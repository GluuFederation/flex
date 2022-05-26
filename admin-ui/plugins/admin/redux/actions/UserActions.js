import {
  UM_GET_USERS,
  UM_UPDATE_USERS_RESPONSE,
  UM_UPDATE_LOADING,
  UM_CREATE_NEW_USER,
  UM_SELECTED_USER_DATA,
} from './types'

export const getUsers = (action) => ({
  type: UM_GET_USERS,
  payload: { action },
})

export const setSelectedUserData = (action) => ({
  type: UM_SELECTED_USER_DATA,
  payload: action,
})

export const updateUserResponse = (action) => ({
  type: UM_UPDATE_USERS_RESPONSE,
  payload: { action },
})
export const UMupdateUserLoading = (action) => ({
  type: UM_UPDATE_LOADING,
  payload: action,
})

export const createNewUser = (action) => {
  console.log('HERE')
  return {
    type: UM_CREATE_NEW_USER,
    payload: action,
  }
}
