import { UM_UPDATE_LOADING, UM_GET_USERS } from '../actions/types'
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
    case UM_GET_USERS:
      return {
        ...state,
        loading: true,
      }
    case UM_UPDATE_LOADING:
      return {
        ...state,
        loading: action.payload,
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
