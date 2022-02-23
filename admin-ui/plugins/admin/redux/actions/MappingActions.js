import {
  GET_MAPPING,
  GET_MAPPING_RESPONSE,
  UPDATE_MAPPING,
  ADD_PERMISSIONS_TO_ROLE,
  UPDATE_PERMISSIONS_TO_SERVER,
  UPDATE_PERMISSIONS_LOADING,
  UPDATE_PERMISSIONS_SERVER_RESPONSE,
  ADD_MAPPING_ROLE_PERMISSIONS,
  DELETE_MAPPING,
} from './types'

export const getMapping = (action) => ({
  type: GET_MAPPING,
  payload: { action },
})

export const getMappingResponse = (data) => ({
  type: GET_MAPPING_RESPONSE,
  payload: { data },
})

export const updateMapping = (data) => ({
  type: UPDATE_MAPPING,
  payload: { data },
})

export const updatePermissionsLoading = (data) => ({
  type: UPDATE_PERMISSIONS_LOADING,
  payload: { data },
})

export const updatePermissionsServerResponse = (data) => ({
  type: UPDATE_PERMISSIONS_SERVER_RESPONSE,
  payload: { data },
})
export const addPermissionsToRole = (data) => ({
  type: ADD_PERMISSIONS_TO_ROLE,
  payload: { data },
})

export const updatePermissionsToServer = (data) => ({
  type: UPDATE_PERMISSIONS_TO_SERVER,
  payload: { data },
})

export const addNewRolePermissions = (data) => ({
  type: ADD_MAPPING_ROLE_PERMISSIONS,
  payload: { data },
})

export const deleteMapping = (data) => ({
  type: DELETE_MAPPING,
  payload: { data },
})
