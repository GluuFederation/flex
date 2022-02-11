import { GET_MAU, GET_MAU_RESPONSE } from './types'

export const getMau = (action) => ({
  type: GET_MAU,
  payload: { action },
})

export const getMauResponse = (data) => ({
  type: GET_MAU_RESPONSE,
  payload: { data },
})
