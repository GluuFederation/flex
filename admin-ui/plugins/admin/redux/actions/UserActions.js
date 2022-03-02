import { UM_GET_USERS } from './types'

export const getUsers = (action) => ({
  type: UM_GET_USERS,
  payload: { action },
})
