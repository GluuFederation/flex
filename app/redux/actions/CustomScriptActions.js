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

export const getCustomScripts = () => ({
  type: GET_CUSTOM_SCRIPT,
})

export const getCustomScriptsResponse = (data) => ({
  type: GET_CUSTOM_SCRIPT_RESPONSE,
  payload: { data },
})

export const addCustomScript = (data) => ({
  type: ADD_CUSTOM_SCRIPT,
  payload: { data },
})

export const addCustomScriptResponse = (data) => ({
  type: ADD_CUSTOM_SCRIPT_RESPONSE,
  payload: { data },
})

export const editCustomScript = (data) => ({
  type: EDIT_CUSTOM_SCRIPT,
  payload: { data },
})

export const editCustomScriptResponse = (data) => ({
  type: EDIT_CUSTOM_SCRIPT_RESPONSE,
  payload: { data },
})

export const getCustomScriptByInum = (inum) => ({
  type: GET_CUSTOM_SCRIPT_BY_INUM,
  payload: { inum },
})

export const getCustomScriptByInumResponse = (data) => ({
  type: GET_CUSTOM_SCRIPT_BY_INUM_RESPONSE,
  payload: { data },
})

export const getCustomScriptByType = (type) => ({
  type: GET_CUSTOM_SCRIPT_BY_TYPE,
  payload: { type },
})

export const getCustomScriptByTypeResponse = (data) => ({
  type: GET_CUSTOM_SCRIPT_BY_TYPE_RESPONSE,
  payload: { data },
})

export const deleteCustomScript = (inum) => ({
  type: DELETE_CUSTOM_SCRIPT,
  payload: { inum },
})

export const deleteCustomScriptResponse = (data) => ({
  type: DELETE_CUSTOM_SCRIPT_RESPONSE,
  payload: { data },
})

export const setCurrentItem = (item) => ({
  type: SET_SCRIPT_ITEM,
  payload: { item },
})
