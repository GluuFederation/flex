import { GET_STAT, GET_STAT_RESPONSE } from '../actions/types'
import reducerRegistry from './ReducerRegistry'

const INIT_STATE = {
  items: [],
  selectedUserData: null,
  loading: true,
  redirectToUserListPage: false,
}
const reducerName = 'statReducer'

export default function statReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_STAT:
      return {
        ...state,
        loading: true,
      }
    case GET_STAT_RESPONSE:
      return {
        ...state,
        loading: false,
        items: action.payload ? action.payload : [],
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
reducerRegistry.register(reducerName, statReducer)
