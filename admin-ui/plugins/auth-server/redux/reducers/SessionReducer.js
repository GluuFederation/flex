import {
  RESET,
  GET_SESSIONS,
  GET_SESSIONS_RESPONSE,
} from '../actions/types'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const INIT_STATE = {
  items: [],
  loading: false,
}

const reducerName = 'SessionReducer'

export default function SessionReducer(state = INIT_STATE, action) {
  switch (action.type) {

    case GET_SESSIONS: 
      return handleLoading()

    case GET_SESSIONS_RESPONSE: 
      if (action.payload.data) {
        return {
          ...state,
          items: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case RESET:
      return {
        ...state,
        items: INIT_STATE.items,
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
  function handleLoading() {
    return {
      ...state,
      loading: true,
    }
  }
}

reducerRegistry.register(reducerName, SessionReducer)