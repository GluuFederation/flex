import {
  GET_PERSISTENCE_TYPE,
  GET_PERSISTENCE_TYPE_RESPONSE,
} from '../actions/types'

const INIT_STATE = {
  type: '',
  loading: false,
}

const reducerName = 'persistenceTypeReducer';

export default function persistenceTypeReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_PERSISTENCE_TYPE:
      return {
        ...state,
        loading: true,
      }
    case GET_PERSISTENCE_TYPE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          type: action.payload.data,
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