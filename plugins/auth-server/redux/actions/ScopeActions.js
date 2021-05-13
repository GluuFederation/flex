import {
  GET_SCOPES,
  GET_SCOPES_RESPONSE,
  ADD_SCOPE,
  ADD_SCOPE_RESPONSE,
  EDIT_SCOPE,
  EDIT_SCOPE_RESPONSE,
  DELETE_SCOPE,
  DELETE_SCOPE_RESPONSE,
  GET_SCOPE_BY_INUM,
  GET_SCOPE_BY_INUM_RESPONSE,
  SET_ITEM,
  GET_SCOPE_BY_PATTERN,
  GET_SCOPE_BY_PATTERN_RESPONSE,
  SEARCH_SCOPES,
} from './types'

export const getScopes = (options) => ({
  type: GET_SCOPES,
  payload: { options },
})

export const searchScopes = (options) => ({
  type: SEARCH_SCOPES,
  payload: { options },
})

export const getScopesResponse = (data) => ({
  type: GET_SCOPES_RESPONSE,
  payload: { data },
})

export const getScope = (inum) => ({
  type: GET_SCOPE_BY_INUM,
  payload: { inum },
})

export const getScopeResponse = (data) => ({
  type: GET_SCOPE_BY_INUM_RESPONSE,
  payload: { data },
})

export const getScopeByPattern = (opts) => ({
  type: GET_SCOPE_BY_PATTERN,
  payload: { opts },
})

export const getScopeByPatternResponse = (data) => ({
  type: GET_SCOPE_BY_PATTERN_RESPONSE,
  payload: { data },
})

export const addScope = (data) => ({
  type: ADD_SCOPE,
  payload: { data },
})

export const addScopeResponse = (data) => ({
  type: ADD_SCOPE_RESPONSE,
  payload: { data },
})

export const editScope = (data) => ({
  type: EDIT_SCOPE,
  payload: { data },
})

export const editScopeResponse = (data) => ({
  type: EDIT_SCOPE_RESPONSE,
  payload: { data },
})

export const deleteScope = (inum) => ({
  type: DELETE_SCOPE,
  payload: { inum },
})

export const deleteScopeResponse = (data) => ({
  type: DELETE_SCOPE_RESPONSE,
  payload: { data },
})

export const setCurrentItem = (item) => ({
  type: SET_ITEM,
  payload: { item },
})
