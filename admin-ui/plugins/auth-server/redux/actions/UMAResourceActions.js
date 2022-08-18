import {
  GET_UMA_RESOURCES,
  GET_UMA_RESOURCES_RESPONSE,
  DELETE_UMA_RESOURCE,
  DELETE_UMA_RESOURCE_RESPONSE,
  RESET
} from './types'

export const getUMAResourcesByClient = (inum) => ({
  type: GET_UMA_RESOURCES,
  payload: { inum },
})

export const getUMAResourcesByClientResponse = (data) => ({
  type: GET_UMA_RESOURCES_RESPONSE,
  payload: { data },
})

export const deleteUMAResource = (action) => ({
  type: DELETE_UMA_RESOURCE,
  payload: { action },
})

export const deleteUMAResourceResponse = (data) => ({
  type: DELETE_UMA_RESOURCE_RESPONSE,
  payload: { data },
})

export const resetUMAResources = () => ({
  type: RESET,
  payload: {},
})
