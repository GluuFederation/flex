import {
  GET_SCRIPTS_FOR_STAT,
  GET_SCRIPTS_FOR_STAT_RESPONSE,
  GET_SCOPES_FOR_STAT,
  GET_SCOPES_FOR_STAT_RESPONSE,
  GET_ATTRIBUTES_FOR_STAT,
  GET_ATTRIBUTES_FOR_STAT_RESPONSE,
  GET_CLIENTS_FOR_STAT,
  GET_CLIENTS_FOR_STAT_RESPONSE,
} from '../actions/types'
import reducerRegistry from './ReducerRegistry'
const INIT_STATE = {
  scripts: [],
  clients: [],
  scopes: [],
  attributes: [],
}

const reducerName = 'initReducer'

export default function initReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_SCRIPTS_FOR_STAT:
      return handleDefault()

    case GET_SCRIPTS_FOR_STAT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          scripts: action.payload.data,
        }
      } else {
        return handleDefault()
      }

    case GET_CLIENTS_FOR_STAT:
      return handleDefault()
    case GET_CLIENTS_FOR_STAT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          clients: action.payload.data,
        }
      } else {
        return handleDefault()
      }

    case GET_ATTRIBUTES_FOR_STAT:
    case GET_ATTRIBUTES_FOR_STAT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          attributes: action.payload.data.entries,
        }
      } else {
        return handleDefault()
      }

    case GET_SCOPES_FOR_STAT:
      return handleDefault()
    case GET_SCOPES_FOR_STAT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          scopes: action.payload.data,
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
reducerRegistry.register(reducerName, initReducer)
