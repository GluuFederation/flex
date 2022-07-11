import { GET_USERS, GET_USERS_RESPONSE } from '../actions/types'
import reducerRegistry from './ReducerRegistry'

const INIT_STATE = {
  items: [],
  selectedUserData: null,
  loading: true,
  redirectToUserListPage: false,
}
const reducerName = 'userReducer'

export default function userReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        loading: true,
      }
    case GET_USERS_RESPONSE:
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
reducerRegistry.register(reducerName, userReducer)
