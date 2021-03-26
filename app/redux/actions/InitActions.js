import { GET_ACR_AUTH_SCRIPT, GET_ACR_AUTH_SCRIPT_RESPONSE } from './types'

export const getAuthScript = () => ({
  type: GET_ACR_AUTH_SCRIPT,
})

export const getAuthScriptResponse = (data) => ({
  type: GET_ACR_AUTH_SCRIPT_RESPONSE,
  payload: { data },
})
