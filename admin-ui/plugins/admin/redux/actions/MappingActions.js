import {
  GET_MAPPING,
  GET_MAPPING_RESPONSE,
  UPDATE_MAPPING,
  ADD_PERMISSIONS_TO_ROLE,
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

export const addPermissionsToRole = (data) => ({
  type: ADD_PERMISSIONS_TO_ROLE,
  payload: { data },
})
