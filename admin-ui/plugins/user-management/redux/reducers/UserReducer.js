import {
  GET_USERS_RESPONSE,
  USERS_LOADING,
  GET_USERS,
  SELECTED_USER_DATA,
  REDIRECT_TO_USERS_LIST,
  CREATE_NEW_USER,
  UPDATE_USER,
  DELETE_USER,
  CHANGE_USERS_PASSWORD,
} from '../actions/types'
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'

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
    case CREATE_NEW_USER:
      return {
        ...state,
        loading: true,
      }
    case CHANGE_USERS_PASSWORD:
      return {
        ...state,
        loading: true,
      }
    case UPDATE_USER:
      return {
        ...state,
        loading: true,
      }
    case DELETE_USER:
      return {
        ...state,
        loading: true,
      }
    case REDIRECT_TO_USERS_LIST:
      return {
        ...state,
        redirectToUserListPage: action.payload,
      }
    case USERS_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case SELECTED_USER_DATA:
      return {
        ...state,
        selectedUserData: action.payload,
      }
    case GET_USERS_RESPONSE:
      return {
        ...state,
        loading: false,
        items: action.payload?.action,
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
