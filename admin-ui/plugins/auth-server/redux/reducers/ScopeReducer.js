import {
  GET_SCOPES,
  GET_SCOPES_RESPONSE,
  GET_SCOPE_BY_INUM,
  GET_SCOPE_BY_INUM_RESPONSE,
  ADD_SCOPE,
  ADD_SCOPE_RESPONSE,
  EDIT_SCOPE,
  EDIT_SCOPE_RESPONSE,
  DELETE_SCOPE,
  DELETE_SCOPE_RESPONSE,
  RESET,
  SET_ITEM,
  GET_SCOPE_BY_PATTERN,
  GET_SCOPE_BY_PATTERN_RESPONSE,
  SEARCH_SCOPES,
} from '../actions/types'
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'
const INIT_STATE = {
  items: [],
  item: {},
  loading: false,
}

const reducerName = 'scopeReducer'

export default function scopeReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_SCOPES:
      return handleLoading()
    case SEARCH_SCOPES:
      return handleLoading()
    case GET_SCOPES_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }
    case GET_SCOPE_BY_INUM:
      return handleLoading()
    case GET_SCOPE_BY_INUM_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          item: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }
    case GET_SCOPE_BY_PATTERN:
      return handleLoading()
    case GET_SCOPE_BY_PATTERN_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          item: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case ADD_SCOPE:
      return handleLoading()
    case ADD_SCOPE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items],
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case EDIT_SCOPE:
      return handleLoading()

    case EDIT_SCOPE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items],
          loading: false,
        }
      } else {
        return handleDefault()
      }
    case DELETE_SCOPE:
      return handleLoading()
    case DELETE_SCOPE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: state.items.filter((i) => i.inum !== action.payload.data),
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case SET_ITEM:
      return {
        ...state,
        item: action.payload.item,
        loading: false,
      }
    case RESET:
      return {
        ...state,
        items: INIT_STATE.items,
        loading: INIT_STATE.loading,
      }
    default:
      return handleDefault()
  }
  function handleLoading() {
    return {
      ...state,
      loading: true,
    }
  }
  function handleDefault() {
    return {
      ...state,
      loading: false,
    }
  }
}
reducerRegistry.register(reducerName, scopeReducer)
