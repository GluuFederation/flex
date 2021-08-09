import {
  GET_CUSTOM_SCRIPT,
  GET_CUSTOM_SCRIPT_RESPONSE,
  ADD_CUSTOM_SCRIPT,
  ADD_CUSTOM_SCRIPT_RESPONSE,
  EDIT_CUSTOM_SCRIPT,
  EDIT_CUSTOM_SCRIPT_RESPONSE,
  GET_CUSTOM_SCRIPT_BY_INUM,
  GET_CUSTOM_SCRIPT_BY_INUM_RESPONSE,
  GET_CUSTOM_SCRIPT_BY_TYPE,
  GET_CUSTOM_SCRIPT_BY_TYPE_RESPONSE,
  DELETE_CUSTOM_SCRIPT,
  DELETE_CUSTOM_SCRIPT_RESPONSE,
  SET_SCRIPT_ITEM,
} from './types'

export const getCustomScripts = (action) => ({
  type: GET_CUSTOM_SCRIPT,
  payload: { action },
})

export const getCustomScriptsResponse = (data) => ({
  type: GET_CUSTOM_SCRIPT_RESPONSE,
  payload: { data },
})

export const addCustomScript = (action) => ({
  type: ADD_CUSTOM_SCRIPT,
  payload: { action },
})

export const addCustomScriptResponse = (data) => ({
  type: ADD_CUSTOM_SCRIPT_RESPONSE,
  payload: { data },
})

export const editCustomScript = (action) => ({
  type: EDIT_CUSTOM_SCRIPT,
  payload: { action },
})

export const editCustomScriptResponse = (data) => ({
  type: EDIT_CUSTOM_SCRIPT_RESPONSE,
  payload: { data },
})

export const getCustomScriptByInum = (action) => ({
  type: GET_CUSTOM_SCRIPT_BY_INUM,
  payload: { action },
})

export const getCustomScriptByInumResponse = (data) => ({
  type: GET_CUSTOM_SCRIPT_BY_INUM_RESPONSE,
  payload: { data },
})

export const getCustomScriptByType = (action) => ({
  type: GET_CUSTOM_SCRIPT_BY_TYPE,
  payload: { action },
})

export const getCustomScriptByTypeResponse = (data) => ({
  type: GET_CUSTOM_SCRIPT_BY_TYPE_RESPONSE,
  payload: { data },
})

export const deleteCustomScript = (action) => ({
  type: DELETE_CUSTOM_SCRIPT,
  payload: { action },
})

export const deleteCustomScriptResponse = (inum) => ({
  type: DELETE_CUSTOM_SCRIPT_RESPONSE,
  payload: { inum },
})

export const setCurrentItem = (item) => ({
  type: SET_SCRIPT_ITEM,
  payload: { item },
})
