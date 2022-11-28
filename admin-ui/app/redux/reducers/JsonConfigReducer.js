import {
  GET_JSON_CONFIG,
  GET_JSONCONFIG_RESPONSE,
  PATCH_JSON_CONFIG,
  PATCH_JSONCONFIG_RESPONSE,
} from '../actions/types'
import reducerRegistry from './ReducerRegistry'
const INIT_STATE = {
  configuration: {},
  loading: false,
}

const reducerName = 'jsonConfigReducer'

export default function jsonConfigReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_JSON_CONFIG:
      return handleLoading()
    case GET_JSONCONFIG_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          configuration: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case PATCH_JSON_CONFIG:
      return handleLoading()
    case PATCH_JSONCONFIG_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          configuration: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }
    default:
      return handleDefault()
  }

  function handleLoading() {
    return {
      ...state,
      loading: true,
    }
  }

  function handleDefault() {
    return {
      ...state,
      loading: false,
    }
  }
}
reducerRegistry.register(reducerName, jsonConfigReducer)
