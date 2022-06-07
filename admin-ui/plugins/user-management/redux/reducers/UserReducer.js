import {
  UM_UPDATE_USERS_RESPONSE,
  UM_UPDATE_LOADING,
  UM_GET_USERS,
  UM_SELECTED_USER_DATA,
  UM_REDIRECT_TO_LIST,
  UM_CREATE_NEW_USER,
  UM_UPDATE_EXISTING_USER,
  UM_DELETE_EXISTING_USER,
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
    case UM_GET_USERS:
      return {
        ...state,
        loading: true,
      }
    case UM_CREATE_NEW_USER:
      return {
        ...state,
        loading: true,
      }
    case UM_UPDATE_EXISTING_USER:
      return {
        ...state,
        loading: true,
      }
    case UM_DELETE_EXISTING_USER:
      return {
        ...state,
        loading: true,
      }
    case UM_REDIRECT_TO_LIST:
      return {
        ...state,
        redirectToUserListPage: action.payload,
      }
    case UM_UPDATE_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case UM_SELECTED_USER_DATA:
      return {
        ...state,
        selectedUserData: action.payload,
      }
    case UM_UPDATE_USERS_RESPONSE:
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
