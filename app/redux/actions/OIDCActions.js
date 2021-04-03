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
} from './types'

export const getOpenidClients = () => ({
  type: GET_OPENID_CLIENTS,
})

export const getOpenidClientsResponse = (data) => ({
  type: GET_OPENID_CLIENTS_RESPONSE,
  payload: { data },
})

export const addNewClientAction = (data) => ({
  type: ADD_NEW_CLIENT,
  payload: { data },
})

export const addClientResponse = (data) => ({
  type: ADD_CLIENT_RESPONSE,
  payload: { data },
})

export const editClient = (data) => ({
  type: EDIT_CLIENT,
  payload: { data },
})
export const editClientResponse = (data) => ({
  type: EDIT_CLIENT_RESPONSE,
  payload: { data },
})

export const deleteClient = (inum) => ({
  type: DELETE_CLIENT,
  payload: { inum },
})

export const deleteClientResponse = (data) => ({
  type: DELETE_CLIENT_RESPONSE,
  payload: { data },
})

export const setCurrentItem = (item) => ({
  type: SET_CLIENT_ITEM,
  payload: { item },
})
