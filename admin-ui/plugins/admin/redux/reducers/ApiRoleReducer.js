import {
  GET_ROLES,
  GET_ROLES_RESPONSE,
  GET_ROLE,
  GET_ROLE_RESPONSE,
  ADD_ROLE,
  ADD_ROLE_RESPONSE,
  EDIT_ROLE,
  EDIT_ROLE_RESPONSE,
  DELETE_ROLE,
  DELETE_ROLE_RESPONSE,
  SET_ROLE_ITEM,
  RESET,
} from '../actions/types'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const INIT_STATE = {
  items: [],
  loading: false,
  isSuccess: false,
  isError: false,
}
const reducerName = 'apiRoleReducer'

export default function apiRoleReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_ROLES:
      return handleLoading()
    case GET_ROLES_RESPONSE:
      if (action.payload.data) {
        return handleItems()
      } else {
        return handleDefault()
      }
    case GET_ROLE:
      return handleLoading()
    case GET_ROLE_RESPONSE:
      if (action.payload.data) {
        return handleItems()
      } else {
        return handleDefault()
      }
    case ADD_ROLE:
      return handleLoading({
        isSuccess: false,
        isError: false,
      })
    case ADD_ROLE_RESPONSE:
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

    case EDIT_ROLE:
      return handleLoading({
        isSuccess: false,
        isError: false,
      })
    case EDIT_ROLE_RESPONSE:
      console.log('action.payload.data', action.payload.data)
      if (action.payload.data) {
        const currentItems = [...state.items]
        currentItems.filter((item) => item.role === action.payload.data.role)
        currentItems.push(action.payload.data)
        return {
          ...state,
          items: currentItems,
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

    case DELETE_ROLE:
      return handleLoading({
        isSuccess: false,
        isError: false,
      })
    case DELETE_ROLE_RESPONSE:
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
    case SET_ROLE_ITEM:
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

  function handleItems() {
    return {
      ...state,
      items: action.payload.data,
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

  function handleDefault(additionalParams) {
    return {
      ...state,
      ...additionalParams,
      loading: false,
    }
  }
}
reducerRegistry.register(reducerName, apiRoleReducer)
