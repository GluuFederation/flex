import {
  GET_JSON_CONFIG,
  GET_JSONCONFIG_RESPONSE,
  PATCH_JSON_CONFIG,
  PATCH_JSONCONFIG_RESPONSE,
} from './types'

export const getJsonConfig = (action) => ({
  type: GET_JSON_CONFIG,
  payload: { action },
})

export const getJsonConfigResponse = (data) => ({
  type: GET_JSONCONFIG_RESPONSE,
  payload: { data },
})

export const patchJsonConfig = (action) => ({
  type: PATCH_JSON_CONFIG,
  payload: { action },
})

export const patchJsonConfigResponse = (data) => ({
  type: PATCH_JSONCONFIG_RESPONSE,
  payload: { data },
})
