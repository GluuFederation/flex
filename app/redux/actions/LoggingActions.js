import {
  GET_LOGGING,
  GET_LOGGING_RESPONSE,
  PUT_LOGGING,
  PUT_LOGGING_RESPONSE,
} from './types'

export const getLoggingConfig = () => ({
  type: GET_LOGGING,
})

export const getLoggingResponse = (data) => ({
  type: GET_LOGGING_RESPONSE,
  payload: { data },
})

export const editLoggingConfig = (data) => ({
  type: PUT_LOGGING,
  payload: { data },
})
export const editLoggingResponse = (data) => ({
  type: PUT_LOGGING_RESPONSE,
  payload: { data },
})
