import {
  GET_OPENID_CLIENTS,
  GET_OPENID_CLIENTS_RESPONSE,
  ADD_NEW_CLIENT,
  ADD_CLIENT_RESPONSE,
  EDIT_CLIENT,
  EDIT_CLIENT_RESPONSE,
  DELETE_CLIENT,
  DELETE_CLIENT_RESPONSE,
  SET_CLIENT_ITEM,
  RESET,
} from '../actions/types'

const INIT_STATE = {
  items: [],
  item: {},
  loading: false,
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_OPENID_CLIENTS:
      return {
        ...state,
        loading: true,
      }
    case GET_OPENID_CLIENTS_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case ADD_NEW_CLIENT:
      return {
        ...state,
        loading: true,
      }
    case ADD_CLIENT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items],
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case EDIT_CLIENT:
      return {
        ...state,
        loading: true,
      }
    case EDIT_CLIENT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items],
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case DELETE_CLIENT:
      return {
        ...state,
        loading: true,
      }

    case DELETE_CLIENT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: state.items.filter((i) => i.inum !== action.payload.data),
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case SET_CLIENT_ITEM:
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
      return {
        ...state,
      }
  }
}
