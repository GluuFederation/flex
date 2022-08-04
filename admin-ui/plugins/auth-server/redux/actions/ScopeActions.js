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
  GET_UMA_RESOURCES,
  GET_UMA_RESOURCES_RESPONSE,
} from './types'

export const getScopes = (action) => ({
  type: GET_SCOPES,
  payload: { action },
})

export const searchScopes = (action) => ({
  type: SEARCH_SCOPES,
  payload: { action },
})

export const getScopesResponse = (data) => ({
  type: GET_SCOPES_RESPONSE,
  payload: { data },
})

export const getScope = (action) => ({
  type: GET_SCOPE_BY_INUM,
  payload: { action },
})

export const getScopeResponse = (data) => ({
  type: GET_SCOPE_BY_INUM_RESPONSE,
  payload: { data },
})

export const getScopeByPattern = (action) => ({
  type: GET_SCOPE_BY_PATTERN,
  payload: { action },
})

export const getScopeByPatternResponse = (data) => ({
  type: GET_SCOPE_BY_PATTERN_RESPONSE,
  payload: { data },
})

export const addScope = (action) => ({
  type: ADD_SCOPE,
  payload: { action },
})

export const addScopeResponse = (data) => ({
  type: ADD_SCOPE_RESPONSE,
  payload: { data },
})

export const editScope = (action) => ({
  type: EDIT_SCOPE,
  payload: { action },
})

export const editScopeResponse = (data) => ({
  type: EDIT_SCOPE_RESPONSE,
  payload: { data },
})

export const deleteScope = (action) => ({
  type: DELETE_SCOPE,
  payload: { action },
})

export const deleteScopeResponse = (data) => ({
  type: DELETE_SCOPE_RESPONSE,
  payload: { data },
})

export const setCurrentItem = (item) => ({
  type: SET_ITEM,
  payload: { item },
})
export const getUMAResources = (item) => ({
  type: GET_UMA_RESOURCES,
  payload: { item },
})
export const getUMAResourcesResponse = (data) => ({
  type: GET_UMA_RESOURCES_RESPONSE,
  payload: { data },
})
