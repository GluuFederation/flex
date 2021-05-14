import {
  GET_JSON_CONFIG,
  GET_JSONCONFIG_RESPONSE,
  PATCH_JSON_CONFIG,
  PATCH_JSONCONFIG_RESPONSE,
} from './types'

export const getJsonConfig = () => ({
  type: GET_JSON_CONFIG,
})

export const getJsonConfigResponse = (data) => ({
  type: GET_JSONCONFIG_RESPONSE,
  payload: { data },
})

export const patchJsonConfig = (options) => ({
  type: PATCH_JSON_CONFIG,
  payload: { options },
})

export const patchJsonConfigResponse = (data) => ({
  type: PATCH_JSONCONFIG_RESPONSE,
  payload: { data },
})
