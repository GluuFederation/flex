import { GET_MAU, GET_MAU_RESPONSE } from '../actions/types'
import reducerRegistry from './ReducerRegistry'
const INIT_STATE = {
  stat: [],
  loading: false,
}

const reducerName = 'mauReducer'

export default function mauReducer(state = INIT_STATE, action) {
  switch (action.type) {
  case GET_MAU:
    return {
      ...state,
      loading: true,
    }
  case GET_MAU_RESPONSE:
    if (action.payload.data) {
      return {
        ...state,
        stat: action.payload.data,
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
reducerRegistry.register(reducerName, mauReducer)
