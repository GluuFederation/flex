import {
  UM_UPDATE_USERS_RESPONSE,
  UM_UPDATE_LOADING,
  UM_GET_USERS,
  UM_SELECTED_USER_DATA,
} from '../actions/types'
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'

const INIT_STATE = {
  items: [],
  selectedUserData: null,
  loading: false,
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
    case UM_SELECTED_USER_DATA:
      return {
        ...state,
        selectedUserData: action.payload,
      }
    case UM_UPDATE_USERS_RESPONSE:
      console.log('USERS', action.payload)
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
      loading: false,
    }
  }
}
reducerRegistry.register(reducerName, userReducer)
