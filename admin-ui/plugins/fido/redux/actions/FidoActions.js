import {
  GET_FIDO_CONFIGURATION,
  GET_FIDO_CONFIGURATION_RESPONSE,
  PUT_FIDO_CONFIGURATION,
  
} from './types'

export const getFidoConfiguration = (action) => ({
  type: GET_FIDO_CONFIGURATION,
  payload: { action },
})

export const putFidoConfiguration = (action) => ({
  type: PUT_FIDO_CONFIGURATION,
  payload: action,
})

export const getFidoConfigurationResponse = (action) => ({
  type: GET_FIDO_CONFIGURATION_RESPONSE,
  payload: action,
})

