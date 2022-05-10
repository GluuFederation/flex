import {
  GET_LOGGING,
  GET_LOGGING_RESPONSE,
  PUT_LOGGING,
  PUT_LOGGING_RESPONSE,
  RESET,
} from '../actions/types'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
const INIT_STATE = {
  logging: {},
  loading: false,
}

const reducerName = 'loggingReducer'

export default function loggingReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_LOGGING:
      return {
        ...state,
        loading: true,
      }
    case GET_LOGGING_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          logging: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }
    case PUT_LOGGING:
      return {
        ...state,
        loading: true,
      }
    case PUT_LOGGING_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          logging: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case RESET:
      return {
        ...state,
        logging: INIT_STATE.logging,
        loading: INIT_STATE.loading,
      }
    default:
      return handleDefault()
  }

  function handleDefault() {
    return {
      ...state,
      loading: false,
    }
  }
}
reducerRegistry.register(reducerName, loggingReducer)
