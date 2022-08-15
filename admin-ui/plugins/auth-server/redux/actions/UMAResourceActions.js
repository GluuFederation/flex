import {
  GET_UMA_RESOURCES,
  GET_UMA_RESOURCES_RESPONSE
} from './types'

export const getUMAResourcesByClient = (inum) => ({
  type: GET_UMA_RESOURCES,
  payload: { inum },
})

export const getUMAResourcesByClientResponse = (data) => ({
  type: GET_UMA_RESOURCES_RESPONSE,
  payload: { data },
})
