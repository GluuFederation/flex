import {
  GET_CUSTOM_SCRIPT,
  GET_OPENID_CLIENTS,
  GET_SCOPES,
  GET_ATTRIBUTES,
} from './types';

export const getCustomScripts = (action) => ({
  type: GET_CUSTOM_SCRIPT,
  payload: { action },
});

export const getOpenidClients = (action) => ({
  type: GET_OPENID_CLIENTS,
  payload: { action },
});

export const getScopes = (action) => ({
  type: GET_SCOPES,
  payload: { action },
});

export const getAttributes = (action) => ({
  type: GET_ATTRIBUTES,
  payload: { action },
});
