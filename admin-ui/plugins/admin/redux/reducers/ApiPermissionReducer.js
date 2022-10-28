import {
  GET_PERMISSIONS,
  GET_PERMISSIONS_RESPONSE,
  GET_PERMISSION,
  GET_PERMISSION_RESPONSE,
  ADD_PERMISSION,
  ADD_PERMISSION_RESPONSE,
  EDIT_PERMISSION,
  EDIT_PERMISSION_RESPONSE,
  DELETE_PERMISSION,
  DELETE_PERMISSION_RESPONSE,
  SET_PERMISSION_ITEM,
  RESET,
} from '../actions/types'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
const INIT_STATE = {
  items: [],
  loading: true,
  isSuccess: false,
  isError: false,
}
const reducerName = 'apiPermissionReducer'

export default function apiPermissionReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_PERMISSIONS:
      return handleLoading()
    case GET_PERMISSIONS_RESPONSE:
      if (action.payload.data) {
        return handleItems()
      } else {
        return handleDefault()
      }
    case GET_PERMISSION:
      return handleLoading()
    case GET_PERMISSION_RESPONSE:
      if (action.payload.data) {
        return handleItems()
      } else {
        return handleDefault()
      }
    case ADD_PERMISSION:
      return handleLoading({
        isSuccess: false,
        isError: false,
      })
    case ADD_PERMISSION_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items, action.payload.data],
          loading: false,
          isSuccess: true,
          isError: false,
        }
      } else {
        return handleDefault({
          isSuccess: false,
          isError: true,
        })
      }

    case EDIT_PERMISSION:
      return handleLoading({
        isSuccess: false,
        isError: false,
      })
    case EDIT_PERMISSION_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...action.payload.data],
          loading: false,
          isSuccess: true,
          isError: false,
        }
      } else {
        return handleDefault({
          isSuccess: false,
          isError: true,
        })
      }

    case DELETE_PERMISSION:
      return handleLoading({
        isSuccess: false,
        isError: false,
      })
    case DELETE_PERMISSION_RESPONSE:
      if (action.payload.inum) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.inum !== action.payload.inum,
          ),
          loading: false,
          isSuccess: true,
          isError: false,
        }
      } else {
        return handleDefault({
          isSuccess: false,
          isError: true,
        })
      }
    case SET_PERMISSION_ITEM:
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
        isSuccess: false,
        isError: false,
      }
    default:
      return handleDefault({
        isSuccess: false,
        isError: false,
      })
  }

  function handleItems() {
    return {
      ...state,
      items: action.payload.data,
      loading: false,
    }
  }

  function handleDefault(additionalParams) {
    return {
      ...state,
      ...additionalParams,
      loading: false,
    }
  }

  function handleLoading(additionalParams) {
    return {
      ...state,
      ...additionalParams,
      loading: true,
    }
  }
}
reducerRegistry.register(reducerName, apiPermissionReducer)
