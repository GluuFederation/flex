import {
  ADD_AGAMA,
  ADD_AGAMA_RESPONSE,
  DELETE_AGAMA,
    GET_AGAMA, GET_AGAMA_RESPONSE
  } from './types'
  
  export const getAgama = () => ({
    type: GET_AGAMA,
  })
  export const getAgamaResponse = (data) => ({
    type: GET_AGAMA_RESPONSE,
    payload: data
  })
  
  export const addAgama = (data) => ({
    type: ADD_AGAMA,
    payload: data
  })
  export const getAddAgamaResponse = (data) => ({
    type: ADD_AGAMA_RESPONSE,
    payload: data
  })
  export const deleteAgama = (data) => ({
    type: DELETE_AGAMA,
    payload: data
  })
  