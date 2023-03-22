import {
    GET_AGAMA, GET_AGAMA_RESPONSE, POST_AGAMA
  } from './types'
  
  export const getAgama = () => ({
    type: GET_AGAMA,
  })
  export const getAgamaResponse = (data) => ({
    type: GET_AGAMA_RESPONSE,
    payload: data
  })
  