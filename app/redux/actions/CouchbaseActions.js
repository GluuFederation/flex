import {
    GET_COUCHBASE,
    GET_COUCHBASE_RESPONSE,
    SET_COUCHBASE,
    SET_COUCHBASE_RESPONSE,
    PUT_COUCHBASE,
    PUT_COUCHBASE_RESPONSE,
  } from './types'
  
  export const getCouchBaseConfig = () => ({
    type: GET_COUCHBASE,
  })
  
  export const getCouchBaseResponse = (data) => ({
    type: GET_COUCHBASE_RESPONSE,
    payload: { data },
  })
  export const addCouchBase = (data) => ({
    type: SET_COUCHBASE,
    payload: { data },
  })
  export const addCouchBaseResponse = (data) => ({
    type: SET_COUCHBASE_RESPONSE,
    payload: { data },
  })
  
  export const editCouchBase = (data) => ({
    type: PUT_COUCHBASE,
    payload: { data },
  })
  export const editCouchBaseResponse = (data) => ({
    type: PUT_COUCHBASE_RESPONSE,
    payload: { data },
  })
  
  
  