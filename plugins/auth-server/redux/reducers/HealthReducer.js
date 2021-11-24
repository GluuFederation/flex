import { GET_HEALTH, GET_HEALTH_RESPONSE } from '../actions/types'
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'
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
        return {
          ...state,
          loading: false,
        }
      }
    default:
      return {
        ...state,
      }
  }
}
reducerRegistry.register(reducerName, healthReducer)
