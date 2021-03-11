import {
  GET_OPENID_CLIENTS,
  GET_OPENID_CLIENTS_RESPONSE,
  SET_CLIENT_ITEM,
} from './types'

export const getOpenidClients = () => ({
  type: GET_OPENID_CLIENTS,
})

export const getOpenidClientsResponse = (data) => ({
  type: GET_OPENID_CLIENTS_RESPONSE,
  payload: { data },
})

export const setCurrentItem = (item) => ({
  type: SET_CLIENT_ITEM,
  payload: { item },
})
