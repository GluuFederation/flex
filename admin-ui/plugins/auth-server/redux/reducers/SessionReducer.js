import {
  RESET,
  GET_SESSIONS,
  GET_SESSIONS_RESPONSE,
  REVOKE_SESSION,
  REVOKE_SESSION_RESPONSE
} from '../actions/types'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const INIT_STATE = {
  items: [],
  item: {},
  loading: false,
  isSuccess: false,
  isError: false,
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

    case REVOKE_SESSION:
      return handleLoading()

    case REVOKE_SESSION_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: state.items.filter(({ userDn }) => userDn !== action.payload.data),
          loading: false,
          isSuccess: true,
          isError: false,
        }
      }
      return handleDefault({
        isSuccess: false,
        isError: true,
      })

    case RESET:
      return {
        ...state,
        items: INIT_STATE.items,
        loading: INIT_STATE.loading,
        isSuccess: false,
        isError: false,
      }

    default:
      return handleDefault()
  }

  function handleDefault(additionalParam) {
    return {
      ...state,
      ...additionalParam,
      loading: false,
    }
  }
  function handleLoading() {
    return {
      ...state,
      isSuccess: false,
      isError: false,
      loading: true,
    }
  }
}

reducerRegistry.register(reducerName, SessionReducer)