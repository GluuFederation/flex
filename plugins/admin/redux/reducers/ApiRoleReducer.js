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
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'
import roles from '../../components/Roles/roles'

const INIT_STATE = {
  items: roles,
  loading: true,
}
const reducerName = 'apiRoleReducer'

export default function apiRoleReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_ROLES:
      return handleLoading()
    case GET_ROLES_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }
    case GET_ROLE:
      return handleLoading()
    case GET_ROLE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }
    case ADD_ROLE:
      return handleLoading()
    case ADD_ROLE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items, action.payload.data],
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case EDIT_ROLE:
      return handleLoading()
    case EDIT_ROLE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items],
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case DELETE_ROLE:
      return handleLoading()
    case DELETE_ROLE_RESPONSE:
      if (action.payload.inum) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.inum !== action.payload.inum,
          ),
          loading: false,
        }
      } else {
        return handleDefault()
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
reducerRegistry.register(reducerName, apiRoleReducer)
