import {
    GET_ATTRIBUTES_FOR_USER_MANAGEMENT,
    GET_ATTRIBUTES_FOR_USER_MANAGEMENT_RESPONSE
  } from './types'
  
  export const getAttributesRoot = (options) => ({
    type: GET_ATTRIBUTES_FOR_USER_MANAGEMENT,
    payload: { options },
  })
  
  export const getAttributesResponseRoot = (data) => ({
    type: GET_ATTRIBUTES_FOR_USER_MANAGEMENT_RESPONSE,
    payload: { data },
  })
