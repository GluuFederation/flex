import { UM_UPDATE_USERS_RESPONSE } from '../actions/types'
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'

const INIT_STATE = {
  items: [],
  loading: false,
}
const reducerName = 'userReducer'

export default function userReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case UM_UPDATE_USERS_RESPONSE:
      console.log(action)
      return {
        ...state,
        loading: false,
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
