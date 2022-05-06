import {
  GET_OIDC_DISCOVERY,
  GET_OIDC_DISCOVERY_RESPONSE,
} from './types'
  
export const getOidcDiscovery = () => ({
  type: GET_OIDC_DISCOVERY,
})
  
export const getOidcDiscoveryResponse = (configuration) => ({
  type: GET_OIDC_DISCOVERY_RESPONSE,
  payload: { configuration },
})
