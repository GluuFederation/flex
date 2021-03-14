import {
    GET_COUCHBASE,
    GET_COUCHBASE_RESPONSE,
    SET_COUCHBASE,
    SET_COUCHBASE_RESPONSE,
    PUT_COUCHBASE,
    PUT_COUCHBASE_RESPONSE,
    SET_API_ERROR,
    RESET,
    SET_ITEM,
  } from '../actions/types'
  
  const INIT_STATE = {
    couchbase: {},
    loading: false,
  }
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_COUCHBASE:
        return {
          ...state,
          loading: true,
        }
      case GET_COUCHBASE_RESPONSE:
        if (action.payload.data) {
          return {
            ...state,
            couchbase: action.payload.data,
            loading: false,
          }
        } else {
          return {
            ...state,
            loading: false,
          }
        }
  
      case SET_COUCHBASE:
        return {
          ...state,
          loading: true,
        }
      case SET_COUCHBASE_RESPONSE:
        return {
          ...state,
          couchbase: action.payload.data,
          loading: false,
        }
  
      case PUT_COUCHBASE:
        return {
          ...state,
          loading: true,
        }
      case PUT_COUCHBASE_RESPONSE:
        return {
          ...state,
          couchbase: state.couchbase,
          loading: false,
        }
  
      case SET_ITEM:
        return {
          ...state,
          item: action.payload.item,
          loading: false,
        }
  
      case SET_API_ERROR:
        return { ...state, loading: false }
      case RESET:
        return {
          ...state,
          couchbase: INIT_STATE.couchbase,
          loading: INIT_STATE.loading,
        }
      default:
        return {
          ...state,
        }
    }
  }
  