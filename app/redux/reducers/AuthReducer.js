/**
 * Auth Reducers
 */
import {
  GET_OAUTH2_CONFIG,
  GET_OAUTH2_CONFIG_RESPONSE,
  GET_OAUTH2_ACCESS_TOKEN,
  GET_OAUTH2_ACCESS_TOKEN_RESPONSE,
  GET_API_ACCESS_TOKEN,
  GET_API_ACCESS_TOKEN_RESPONSE
} from "../actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  isAuthenticated: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_OAUTH2_CONFIG:
      return {
        ...state,
        isAuthenticated: false
      };
    case GET_OAUTH2_CONFIG_RESPONSE:
      return {
        ...state,
        isAuthenticated: false,
        config: action.payload.config
      };

    case GET_OAUTH2_ACCESS_TOKEN:
      return {
        ...state
      };
    case GET_API_ACCESS_TOKEN:
      return {
        ...state
      };
    case GET_OAUTH2_ACCESS_TOKEN_RESPONSE:
      if (action.payload.accessToken) {
        localStorage.setItem("gluu.access.token", action.payload.accessToken);
      }
      return {
        ...state,
        isAuthenticated: true
      };
    case GET_API_ACCESS_TOKEN_RESPONSE:
      if (action.payload.accessToken) {
        localStorage.setItem("gluu.api.token", action.payload.accessToken);
      }
      return {
        ...state
      };
    default:
      return {
        ...state
      };
  }
};
