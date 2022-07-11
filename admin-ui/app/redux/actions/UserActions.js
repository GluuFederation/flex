import { GET_USERS, GET_USERS_RESPONSE } from './types'

export const getUsers = (action) => ({
  type: GET_USERS,
  payload: { action },
})

export const getUserResponse = (action) => ({
  type: GET_USERS_RESPONSE,
  payload: { action },
})
