import {
    GET_PERSISTENCE_TYPE,
    GET_PERSISTENCE_TYPE_RESPONSE,
  } from './types'
  
  export const getPersistenceType = () => ({
    type: GET_PERSISTENCE_TYPE,
  })
  
  export const getPersistenceTypeResponse = (data) => ({
    type: GET_PERSISTENCE_TYPE_RESPONSE,
    payload: { data },
  })