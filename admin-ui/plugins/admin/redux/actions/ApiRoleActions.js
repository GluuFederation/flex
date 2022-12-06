import {
  GET_ROLES,
  GET_ROLES_RESPONSE,
  ADD_ROLE,
  ADD_ROLE_RESPONSE,
  EDIT_ROLE,
  EDIT_ROLE_RESPONSE,
  GET_ROLE,
  GET_ROLE_RESPONSE,
  DELETE_ROLE,
  DELETE_ROLE_RESPONSE,
  SET_ROLE_ITEM,
  ROLE_UPDATE_TOAST
} from './types'

export const getRoles = (action) => ({
  type: GET_ROLES,
  payload: { action },
})

export const updateToastValue =(data) => ({
  type:ROLE_UPDATE_TOAST,
  payload:{data}
})

export const getRolesResponse = (data) => ({
  type: GET_ROLES_RESPONSE,
  payload: { data },
})

export const addRole = (action) => ({
  type: ADD_ROLE,
  payload: { action },
})

export const addRoleResponse = (data) => ({
  type: ADD_ROLE_RESPONSE,
  payload: { data },
})

export const editRole = (action) => ({
  type: EDIT_ROLE,
  payload: { action },
})

export const editRoleResponse = (data) => ({
  type: EDIT_ROLE_RESPONSE,
  payload: { data },
})

export const getRole = (action) => ({
  type: GET_ROLE,
  payload: { action },
})

export const getRoleResponse = (data) => ({
  type: GET_ROLE_RESPONSE,
  payload: { data },
})

export const deleteRole = (action) => ({
  type: DELETE_ROLE,
  payload: { action },
})

export const deleteRoleResponse = (inum) => ({
  type: DELETE_ROLE_RESPONSE,
  payload: { inum },
})

export const setCurrentItem = (item) => ({
  type: SET_ROLE_ITEM,
  payload: { item },
})
