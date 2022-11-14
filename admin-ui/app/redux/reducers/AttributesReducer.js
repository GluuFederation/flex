import { GET_ATTRIBUTES_FOR_USER_MANAGEMENT, GET_ATTRIBUTES_FOR_USER_MANAGEMENT_RESPONSE } from '../actions/types'
import _ from 'lodash'
import reducerRegistry from './ReducerRegistry'
const INIT_STATE = {
  items:[],
  loading: false,
}

const reducerName = 'attributesReducerRoot'

export default function attributesReducerRoot(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_ATTRIBUTES_FOR_USER_MANAGEMENT:
      return {
        ...state,
        loading: true,
      }
    case GET_ATTRIBUTES_FOR_USER_MANAGEMENT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          loading: false,
          items: _.unionBy(action.payload.data.entries, state.items, 'displayName'),
        }
      } else {
        return handleDefault()
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
reducerRegistry.register(reducerName, attributesReducerRoot)
