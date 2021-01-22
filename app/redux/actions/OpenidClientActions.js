import {
  GET_OPENID_CLIENTS,
  GET_OPENID_CLIENTS_RESPONSE,
  SET_API_ERROR
} from "./types";

export const getOpenidClients = () => ({
  type: GET_OPENID_CLIENTS
});

export const getOpenidClientsResponse = data => ({
   type: GET_OPENID_CLIENTS_RESPONSE,
   payload: { data }
});

export const setApiError = error => ({
  type: SET_API_ERROR,
  payload: { error }
});


