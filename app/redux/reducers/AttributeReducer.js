import {
  GET_ATTRIBUTES,
  GET_ATTRIBUTES_RESPONSE,
  ADD_ATTRIBUTE,
  ADD_ATTRIBUTE_RESPONSE,
  EDIT_ATTRIBUTE,
  EDIT_ATTRIBUTE_RESPONSE,
  DELETE_ATTRIBUTE,
  DELETE_ATTRIBUTE_RESPONSE,
  RESET,
  SET_ATTRIBUTE_ITEM,
  SEARCH_ATTRIBUTES,
} from '../actions/types'
import reducerRegistry from './ReducerRegistry';
const INIT_STATE = {
  items: [],
  item: {},
  loading: false,
}

const reducerName = 'attributeReducer';

export default function attributeReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_ATTRIBUTES:
      return {
        ...state,
        loading: true,
      }
    case SEARCH_ATTRIBUTES:
      return {
        ...state,
        loading: true,
      }
    case GET_ATTRIBUTES_RESPONSE:
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

    case ADD_ATTRIBUTE:
      return {
        ...state,
        loading: true,
      }
    case ADD_ATTRIBUTE_RESPONSE:
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

    case EDIT_ATTRIBUTE:
      return {
        ...state,
        loading: true,
      }
    case EDIT_ATTRIBUTE_RESPONSE:
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

    case DELETE_ATTRIBUTE:
      return {
        ...state,
        loading: true,
      }

    case DELETE_ATTRIBUTE_RESPONSE:
      if (action.payload.inum) {
        return {
          ...state,
          items: state.items.filter((i) => i.inum !== action.payload.inum),
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case SET_ATTRIBUTE_ITEM:
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

reducerRegistry.register(reducerName, attributeReducer);