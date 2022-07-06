import {
  GET_USERS,
  GET_USERS_RESPONSE,
  USERS_LOADING,
  CREATE_NEW_USER,
  SELECTED_USER_DATA,
  UPDATE_USER,
  REDIRECT_TO_USERS_LIST,
  DELETE_USER,
  CHANGE_USERS_PASSWORD,
} from './types'

export const getUsers = (action) => ({
  type: GET_USERS,
  payload: { action },
})

export const setSelectedUserData = (action) => ({
  type: SELECTED_USER_DATA,
  payload: action,
})

export const getUserResponse = (action) => ({
  type: GET_USERS_RESPONSE,
  payload: { action },
})
export const usersLoading = (action) => ({
  type: USERS_LOADING,
  payload: action,
})

export const createUser = (action) => {
  return {
    type: CREATE_NEW_USER,
    payload: action,
  }
}

export const redirectToListPage = (action) => {
  return {
    type: REDIRECT_TO_USERS_LIST,
    payload: action,
  }
}

export const updateUser = (action) => {
  return {
    type: UPDATE_USER,
    payload: action,
  }
}
export const changeUserPassword = (action) => {
  return {
    type: CHANGE_USERS_PASSWORD,
    payload: action,
  }
}

export const deleteUser = (inum) => {
  return {
    type: DELETE_USER,
    payload: inum,
  }
}
