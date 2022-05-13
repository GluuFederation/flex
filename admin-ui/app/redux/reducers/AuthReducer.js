import {
  GET_OAUTH2_CONFIG,
  GET_OAUTH2_CONFIG_RESPONSE,
  USERINFO_REQUEST,
  USERINFO_RESPONSE,
  GET_API_ACCESS_TOKEN,
  GET_API_ACCESS_TOKEN_RESPONSE,
  GET_USER_LOCATION,
  GET_USER_LOCATION_RESPONSE,
} from '../actions/types'
import reducerRegistry from './ReducerRegistry'
const INIT_STATE = {
  isAuthenticated: false,
  userinfo: null,
  userinfo_jwt: null,
  token: null,
  issuer: null,
  permissions: [],
  location: {},
  config: {},
  backendIsUp: true,
}

const reducerName = 'authReducer'

export default function authReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_USER_LOCATION:
      return handleDefault()
    case GET_USER_LOCATION_RESPONSE:
      if (action.payload.location) {
        return {
          ...state,
          location: action.payload.location,
        }
      } else {
        return handleDefault()
      }
    case GET_OAUTH2_CONFIG:
      return handleDefault()
    case GET_OAUTH2_CONFIG_RESPONSE:
      if (action.payload.config && action.payload.config != -1) {
        let newDataConfigObject = Object.assign(state.config, {
          ...action.payload.config,
        })
        return {
          ...state,
          ...newDataConfigObject,
          backendIsUp: true,
        }
      } else {
        return {
          ...state,
          backendIsUp: false,
        }
      }

    case USERINFO_REQUEST:
      return handleDefault()
    case USERINFO_RESPONSE:
      if (action.payload.uclaims) {
        return {
          ...state,
          userinfo: action.payload.uclaims,
          userinfo_jwt: action.payload.ujwt,
          permissions: action.payload.scopes,
          isAuthenticated: true,
        }
      } else {
        return {
          ...state,
          isAuthenticated: true,
        }
      }

    case GET_API_ACCESS_TOKEN:
      return handleDefault()

    case GET_API_ACCESS_TOKEN_RESPONSE:
      if (action.payload.accessToken) {
        return {
          ...state,
          token: action.payload.accessToken,
          issuer: action.payload.accessToken.issuer,
          permissions: action.payload.accessToken.scopes,
          isAuthenticated: true,
        }
      } else {
        return handleDefault()
      }

    default:
      return handleDefault()
  }

  function handleDefault() {
    return {
      ...state,
    }
  }
}
reducerRegistry.register(reducerName, authReducer)
