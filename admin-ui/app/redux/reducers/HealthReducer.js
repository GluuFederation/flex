import { GET_HEALTH, GET_HEALTH_RESPONSE } from '../actions/types'
import reducerRegistry from './ReducerRegistry'
const INIT_STATE = {
  serverStatus: null,
  dbStatus: null,
  loading: false,
}

const reducerName = 'healthReducer'

export default function healthReducer(state = INIT_STATE, action) {
  switch (action.type) {
  case GET_HEALTH:
    return {
      ...state,
      loading: true,
    }
  case GET_HEALTH_RESPONSE:
    if (action.payload.data) {
      return {
        ...state,
        serverStatus: action.payload.data.status,
        dbStatus: action.payload.data.db_status,
        loading: false,
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
      loading: false,
    }
  }
}
reducerRegistry.register(reducerName, healthReducer)
