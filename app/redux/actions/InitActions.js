import {
  GET_ATTRIBUTES_FOR_STAT,
  GET_ATTRIBUTES_FOR_STAT_RESPONSE,
  GET_SCRIPTS_FOR_STAT,
  GET_SCRIPTS_FOR_STAT_RESPONSE,
  GET_CLIENTS_FOR_STAT,
  GET_CLIENTS_FOR_STAT_RESPONSE,
  GET_SCOPES_FOR_STAT,
  GET_SCOPES_FOR_STAT_RESPONSE,
} from './types'

export const getScripts = (action) => ({
  type: GET_SCRIPTS_FOR_STAT,
  payload: { action },
})
export const getScriptsResponse = (data) => ({
  type: GET_SCRIPTS_FOR_STAT_RESPONSE,
  payload: { data },
})
export const getClients = (action) => ({
  type: GET_CLIENTS_FOR_STAT,
  payload: { action },
})

export const getClientsResponse = (data) => ({
  type: GET_CLIENTS_FOR_STAT_RESPONSE,
  payload: { data },
})

export const getScopes = (action) => ({
  type: GET_SCOPES_FOR_STAT,
  payload: { action },
})

export const getScopesResponse = (data) => ({
  type: GET_SCOPES_FOR_STAT_RESPONSE,
  payload: { data },
})

export const getAttributes = (action) => ({
  type: GET_ATTRIBUTES_FOR_STAT,
  payload: { action },
})

export const getAttributesResponse = (data) => ({
  type: GET_ATTRIBUTES_FOR_STAT_RESPONSE,
  payload: { data },
})
