import {
  GET_SCOPES,
  GET_SCOPES_RESPONSE,
  DELETE_SCOPE,
  DELETE_SCOPE_RESPONSE,
  GET_SCOPE_BY_INUM,
  GET_SCOPE_BY_INUM_RESPONSE
} from "./types";

export const deleteScope = inum => ({
  type: DELETE_SCOPE,
  payload: { inum }
});

export const deleteScopeResponse = data => ({
  type: DELETE_SCOPE_RESPONSE,
  payload: { data }
});

export const getScopes = () => ({
  type: GET_SCOPES
});

export const getScopesResponse = data => ({
  type: GET_SCOPES_RESPONSE,
  payload: { data }
});

export const getScope = inum => ({
  type: GET_SCOPE_BY_INUM,
  payload: { inum }
});

export const getScopeResponse = data => ({
  type: GET_SCOPE_BY_INUM_RESPONSE,
  payload: { data }
});
