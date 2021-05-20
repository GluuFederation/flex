import {
  GET_CUSTOM_SCRIPT,
  GET_OPENID_CLIENTS,
  GET_SCOPES,
  GET_ATTRIBUTES,
} from './types'

export const getCustomScripts = () => ({
  type: GET_CUSTOM_SCRIPT,
})

export const getOpenidClients = (options) => ({
  type: GET_OPENID_CLIENTS,
  payload: { options },
})

export const getScopes = (options) => ({
  type: GET_SCOPES,
  payload: { options },
})

export const getAttributes = (options) => ({
  type: GET_ATTRIBUTES,
  payload: { options },
})
