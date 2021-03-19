import {
    GET_JWKS,
    GET_JWKS_RESPONSE,
    RESET,
  } from '../actions/types'
  
  const INIT_STATE = {
    jwks: {},
    loading: false,
  }
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_JWKS:
        return {
          ...state,
          loading: true,
        }
      case GET_JWKS_RESPONSE:
        if (action.payload.data) {
          return {
            ...state,
            jwks: action.payload.data,
            loading: false,
          }
        } else {
          return {
            ...state,
            loading: false,
          }
        } 
      case RESET:
        return {
          ...state,
          jwks: INIT_STATE.jwks,
          loading: INIT_STATE.loading,
        }
      default:
        return {
          ...state,
        }
    }
  }
  