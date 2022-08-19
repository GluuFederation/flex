import {
  RESET,
  GET_UMA_RESOURCES,
  GET_UMA_RESOURCES_RESPONSE,
  DELETE_UMA_RESOURCE,
  DELETE_UMA_RESOURCE_RESPONSE,
} from '../actions/types'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const INIT_STATE = {
  items: [],
  loading: false,
}

const reducerName = 'UMAResourceReducer'

export default function UMAResourceReducer(state = INIT_STATE, action) {
  switch (action.type) {

    case GET_UMA_RESOURCES: 
      return handleLoading()

    case GET_UMA_RESOURCES_RESPONSE: 
      if (action.payload.data) {
        return {
          ...state,
          items: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case DELETE_UMA_RESOURCE:
      return handleLoading()

    case DELETE_UMA_RESOURCE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: state.items.filter(({ id }) => id !== action.payload.data),
          loading: false,
        }
      }
      return handleDefault()

    case RESET:
      return {
        ...state,
        items: INIT_STATE.items,
        loading: INIT_STATE.loading,
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
  function handleLoading() {
    return {
      ...state,
      loading: true,
    }
  }
}

reducerRegistry.register(reducerName, UMAResourceReducer)