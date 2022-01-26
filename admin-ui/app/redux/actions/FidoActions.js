import {
  GET_FIDO,
  GET_FIDO_RESPONSE,
  PUT_FIDO,
  PUT_FIDO_RESPONSE,
} from './types'

export const getFidoConfig = () => ({
  type: GET_FIDO,
})

export const getFidoResponse = (data) => ({
  type: GET_FIDO_RESPONSE,
  payload: { data },
})

export const editFidoConfig = (data) => ({
  type: PUT_FIDO,
  payload: { data },
})
export const editFidoResponse = (data) => ({
  type: PUT_FIDO_RESPONSE,
  payload: { data },
})
