import {
  UM_GET_USERS,
  UM_UPDATE_USERS_RESPONSE,
  UM_UPDATE_LOADING,
  UM_CREATE_NEW_USER,
  UM_SELECTED_USER_DATA,
  UM_UPDATE_EXISTING_USER,
  UM_REDIRECT_TO_LIST,
  UM_DELETE_EXISTING_USER,
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
  return {
    type: UM_CREATE_NEW_USER,
    payload: action,
  }
}

export const redirectToListPage = (action) => {
  return {
    type: UM_REDIRECT_TO_LIST,
    payload: action,
  }
}

export const updateExistingUser = (action) => {
  return {
    type: UM_UPDATE_EXISTING_USER,
    payload: action,
  }
}

export const deleteExistingUser = (inum) => {
  return {
    type: UM_DELETE_EXISTING_USER,
    payload: inum,
  }
}
