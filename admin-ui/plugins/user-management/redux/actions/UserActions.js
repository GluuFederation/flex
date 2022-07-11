import {
  GET_USERS,
  GET_USERS_RESPONSE,
  CREATE_NEW_USER,
  CREATE_NEW_USER_RESPONSE,
  SELECTED_USER_DATA,
  UPDATE_USER,
  UPDATE_USER_RESPONSE,
  DELETE_USER,
  DELETE_USER_RESPONSE,
  CHANGE_USERS_PASSWORD,
  CHANGE_USERS_PASSWORD_RESPONSE,
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
  payload: action,
})

export const createUser = (action) => {
  return {
    type: CREATE_NEW_USER,
    payload: action,
  }
}

export const createUserResponse = (action) => {
  return {
    type: CREATE_NEW_USER_RESPONSE,
    payload: action,
  }
}

export const updateUser = (action) => {
  return {
    type: UPDATE_USER,
    payload: action,
  }
}

export const updateUserResponse = (action) => {
  return {
    type: UPDATE_USER_RESPONSE,
    payload: action,
  }
}
export const changeUserPassword = (action) => {
  return {
    type: CHANGE_USERS_PASSWORD,
    payload: action,
  }
}

export const changeUserPasswordResponse = (action) => {
  return {
    type: CHANGE_USERS_PASSWORD_RESPONSE,
    payload: action,
  }
}

export const deleteUser = (inum) => {
  return {
    type: DELETE_USER,
    payload: inum,
  }
}

export const deleteUserResponse = (action) => {
  return {
    type: DELETE_USER_RESPONSE,
    payload: action,
  }
}
