import {
  GET_PERMISSIONS,
  GET_PERMISSIONS_RESPONSE,
  ADD_PERMISSION,
  ADD_PERMISSION_RESPONSE,
  EDIT_PERMISSION,
  EDIT_PERMISSION_RESPONSE,
  GET_PERMISSION,
  GET_PERMISSION_RESPONSE,
  DELETE_PERMISSION,
  DELETE_PERMISSION_RESPONSE,
  SET_PERMISSION_ITEM,
} from './types'

export const getPermissions = (action) => ({
  type: GET_PERMISSIONS,
  payload: { action },
})

export const getPermissionsResponse = (data) => ({
  type: GET_PERMISSIONS_RESPONSE,
  payload: { data },
})

export const addPermission = (action) => ({
  type: ADD_PERMISSION,
  payload: { action },
})

export const addPermissionResponse = (data) => ({
  type: ADD_PERMISSION_RESPONSE,
  payload: { data },
})

export const editPermission = (action) => ({
  type: EDIT_PERMISSION,
  payload: { action },
})

export const editPermissionResponse = (data) => ({
  type: EDIT_PERMISSION_RESPONSE,
  payload: { data },
})

export const getPermission = (action) => ({
  type: GET_PERMISSION,
  payload: { action },
})

export const getPermissionResponse = (data) => ({
  type: GET_PERMISSION_RESPONSE,
  payload: { data },
})

export const deletePermission = (action) => ({
  type: DELETE_PERMISSION,
  payload: { action },
})

export const deletePermissionResponse = (inum) => ({
  type: DELETE_PERMISSION_RESPONSE,
  payload: { inum },
})

export const setCurrentItem = (item) => ({
  type: SET_PERMISSION_ITEM,
  payload: { item },
})
