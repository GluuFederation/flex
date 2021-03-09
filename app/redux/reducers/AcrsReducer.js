import {
    GET_ACRS,
    GET_ACRS_RESPONSE,
    PUT_ACRS,
    PUT_ACRS_RESPONSE,
  } from '../actions/types'
  
  const INIT_STATE = {
    acr: {},
    loading: false,
  }
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_ACRS:
        return {
          ...state,
          loading: true,
        }
      case GET_ACRS_RESPONSE:
        if (action.payload.data) {
          return {
            ...state,
            acrs: action.payload.data,
            loading: false,
          }
        } else {
          return {
            ...state,
            loading: false,
          }
        }
  
      case PUT_ACRS:
        return {
          ...state,
          loading: true,
        }
      case PUT_ACRS_RESPONSE:
        return {
          ...state,
          acrs: state.acrs,
          loading: false,
        }
      default:
        return {
          ...state,
        }
    }
  }
  