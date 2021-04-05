import {
  GET_CUSTOM_SCRIPT,
  GET_CUSTOM_SCRIPT_RESPONSE,
  ADD_CUSTOM_SCRIPT,
  ADD_CUSTOM_SCRIPT_RESPONSE,
  EDIT_CUSTOM_SCRIPT,
  EDIT_CUSTOM_SCRIPT_RESPONSE,
  GET_CUSTOM_SCRIPT_BY_INUM,
  GET_CUSTOM_SCRIPT_BY_INUM_RESPONSE,
  GET_CUSTOM_SCRIPT_BY_TYPE,
  GET_CUSTOM_SCRIPT_BY_TYPE_RESPONSE,
  SET_SCRIPT_ITEM,
  DELETE_CUSTOM_SCRIPT,
  DELETE_CUSTOM_SCRIPT_RESPONSE,
  RESET,
} from '../actions/types'

const INIT_STATE = {
  items: [],
  loading: true,
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true,
      }
    case GET_CUSTOM_SCRIPT_RESPONSE:
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

    case ADD_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true,
      }
    case ADD_CUSTOM_SCRIPT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items, action.payload.data],
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case EDIT_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true,
      }
    case EDIT_CUSTOM_SCRIPT_RESPONSE:
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

    case DELETE_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true,
      }
    case DELETE_CUSTOM_SCRIPT_RESPONSE:
      if (action.payload.inum) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.inum !== action.payload.inum,
          ),
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }
    case SET_SCRIPT_ITEM:
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
