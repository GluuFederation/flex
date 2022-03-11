import { UM_GET_USERS, UM_UPDATE_USERS_RESPONSE } from './types'

export const getUsers = (action) => ({
  type: UM_GET_USERS,
  payload: { action },
})

export const updateUserResponse = (action) => ({
  type: UM_UPDATE_USERS_RESPONSE,
  payload: { action },
})
