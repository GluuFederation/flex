import {
  GET_USERS_RESPONSE,
  GET_USERS,
  SELECTED_USER_DATA,
  CREATE_NEW_USER,
  CREATE_NEW_USER_RESPONSE,
  UPDATE_USER,
  DELETE_USER,
  CHANGE_USERS_PASSWORD,
  CHANGE_USERS_PASSWORD_RESPONSE,
  UPDATE_USER_RESPONSE,
  DELETE_USER_RESPONSE,
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
        redirectToUserListPage: false,
      }
    case CREATE_NEW_USER:
      return {
        ...state,
        loading: true,
      }
    case CREATE_NEW_USER_RESPONSE:
      return {
        ...state,
        loading: false,
        redirectToUserListPage: action.payload ? true : false,
      }
    case CHANGE_USERS_PASSWORD:
      return {
        ...state,
        loading: true,
      }
    case CHANGE_USERS_PASSWORD_RESPONSE:
      return {
        ...state,
        loading: true,
      }
    case UPDATE_USER:
      return {
        ...state,
        loading: true,
      }
    case UPDATE_USER_RESPONSE:
      return {
        ...state,
        loading: false,
        redirectToUserListPage: action.payload ? true : false,
      }
    case DELETE_USER:
      return {
        ...state,
        loading: true,
      }
    case DELETE_USER_RESPONSE:
      return {
        ...state,
        loading: true,
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
