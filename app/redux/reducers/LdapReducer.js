import {
    GET_LDAP,
    GET_LDAP_RESPONSE,
    SET_LDAP,
    SET_LDAP_RESPONSE,
    PUT_LDAP,
    PUT_LDAP_RESPONSE,
    SET_API_ERROR,
    RESET,
    SET_ITEM,
  } from '../actions/types'
  
  const INIT_STATE = {
    ldap: {},
    loading: false,
  }
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_LDAP:
        return {
          ...state,
          loading: true,
        }
      case GET_LDAP_RESPONSE:
        if (action.payload.data) {
          return {
            ...state,
            ldap: action.payload.data,
            loading: false,
          }
        } else {
          return {
            ...state,
            loading: false,
          }
        }
  
      case SET_LDAP:
        return {
          ...state,
          loading: true,
        }
      case SET_LDAP_RESPONSE:
        return {
          ...state,
          ldap: action.payload.data,
          loading: false,
        }
  
      case PUT_LDAP:
        return {
          ...state,
          loading: true,
        }
      case PUT_LDAP_RESPONSE:
        return {
          ...state,
          ldap: state.ldap,
          loading: false,
        }
  
      case SET_ITEM:
        return {
          ...state,
          ldap: action.payload.ldap,
          loading: false,
        }
  
      case SET_API_ERROR:
        return { ...state, loading: false}
      case RESET:
        return {
          ...state,
          ldap: INIT_STATE.ldap,
          loading: INIT_STATE.loading,
        }
      default:
        return {
          ...state,
        }
    }
  }
  