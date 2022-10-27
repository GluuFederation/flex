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
  isSuccess: false,
  isError: false,
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
        isSuccess: false,
        isError: false,
      }
    case PUT_LOGGING_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          logging: action.payload.data,
          loading: false,
          isSuccess: true,
        }
      } else {
        return handleDefault({ isError: true })
      }

    case RESET:
      return {
        ...state,
        logging: INIT_STATE.logging,
        loading: INIT_STATE.loading,
        isSuccess: false,
        isError: false,
      }
    default:
      return handleDefault()
  }

  function handleDefault(additionalParams) {
    return {
      ...state,
      ...additionalParams,
      loading: false,
    }
  }
}
reducerRegistry.register(reducerName, loggingReducer)
