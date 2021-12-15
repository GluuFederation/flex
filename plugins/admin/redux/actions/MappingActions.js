import { GET_MAPPING, GET_MAPPING_RESPONSE } from './types'

export const getMapping = (action) => ({
  type: GET_MAPPING,
  payload: { action },
})

export const getMappingResponse = (data) => ({
  type: GET_MAPPING_RESPONSE,
  payload: { data },
})
