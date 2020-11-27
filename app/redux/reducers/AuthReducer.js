/**
 * Auth Reducers
 */
import {
  GET_OAUTH2_CONFIG,
  GET_OAUTH2_CONFIG_RESPONSE,
  GET_OAUTH2_ACCESS_TOKEN,
  GET_OAUTH2_ACCESS_TOKEN_RESPONSE,
} from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
  loading: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {

  case GET_OAUTH2_CONFIG:
    return {
      ...state, loading: true
    };
  case GET_OAUTH2_CONFIG_RESPONSE:
    return {
      ...state, loading: false, config: action.payload.config
    };

  case GET_OAUTH2_ACCESS_TOKEN:
    return { 
      ...state, loading: true
    };
  case GET_OAUTH2_ACCESS_TOKEN_RESPONSE:
    if (action.payload.accessToken) {
      localStorage.setItem('gluu.access.token', action.payload.accessToken);
    }
    return {
      ...state, loading: false
    };

  default:
    return {
      ...state
    };
  }
};