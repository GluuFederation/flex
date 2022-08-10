import {
  GET_OPENID_CLIENTS,
  GET_OPENID_CLIENTS_RESPONSE,
  ADD_NEW_CLIENT,
  ADD_CLIENT_RESPONSE,
  EDIT_CLIENT,
  EDIT_CLIENT_RESPONSE,
  DELETE_CLIENT,
  DELETE_CLIENT_RESPONSE,
  SET_CLIENT_ITEM,
  SET_VIEW,
  SEARCH_CLIENTS,
  GET_UMA_RESOURCES,
  GET_UMA_RESOURCES_RESPONSE
} from './types'

export const getOpenidClients = (action) => ({
  type: GET_OPENID_CLIENTS,
  payload: { action },
})

export const searchClients = (action) => ({
  type: SEARCH_CLIENTS,
  payload: { action },
})

export const getOpenidClientsResponse = (data) => ({
  type: GET_OPENID_CLIENTS_RESPONSE,
  payload: { data },
})

export const addNewClientAction = (action) => ({
  type: ADD_NEW_CLIENT,
  payload: { action },
})

export const addClientResponse = (data) => ({
  type: ADD_CLIENT_RESPONSE,
  payload: { data },
})

export const editClient = (action) => ({
  type: EDIT_CLIENT,
  payload: { action },
})
export const editClientResponse = (data) => ({
  type: EDIT_CLIENT_RESPONSE,
  payload: { data },
})

export const deleteClient = (action) => ({
  type: DELETE_CLIENT,
  payload: { action },
})

export const deleteClientResponse = (data) => ({
  type: DELETE_CLIENT_RESPONSE,
  payload: { data },
})

export const setCurrentItem = (item) => ({
  type: SET_CLIENT_ITEM,
  payload: { item },
})

export const viewOnly = (view) => ({
  type: SET_VIEW,
  payload: { view },
})

export const getUMAResourcesByClient = (inum) => ({
  type: GET_UMA_RESOURCES,
  payload: { inum },
})

export const getUMAResourcesByClientResponse = (data) => ({
  type: GET_UMA_RESOURCES_RESPONSE,
  payload: { data },
})
