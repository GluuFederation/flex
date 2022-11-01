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

const INIT_STATE = {
  items: [],
  item: {},
  loading: false,
  totalItems: 0,
  entriesCount: 0,
  isSuccess: false,
  isError: false,
}

const reducerName = 'attributeReducer'

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
          items: action.payload.data.entries,
          totalItems: action.payload.data.totalEntriesCount,
          entriesCount: action.payload.data.entriesCount,
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
        isSuccess: false,
        isError: false,
      }
    case ADD_ATTRIBUTE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items, action.payload.data],
          loading: false,
          isSuccess: true,
          isError: false,
        }
      } else {
        return {
          ...state,
          loading: false,
          isSuccess: false,
          isError: true,
        }
      }

    case EDIT_ATTRIBUTE:
      return {
        ...state,
        loading: true,
        isSuccess: false,
        isError: false,
      }
    case EDIT_ATTRIBUTE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items],
          loading: false,
          isSuccess: true,
          isError: false,
        }
      } else {
        return {
          ...state,
          loading: false,
          isSuccess: false,
          isError: true,
        }
      }

    case DELETE_ATTRIBUTE:
      return {
        ...state,
        loading: true,
        isSuccess: false,
        isError: false,
      }

    case DELETE_ATTRIBUTE_RESPONSE:
      if (action.payload.inum) {
        return {
          ...state,
          items: state.items.filter((i) => i.inum !== action.payload.inum),
          loading: false,
          isSuccess: true,
          isError: false,
        }
      } else {
        return {
          ...state,
          loading: false,
          isSuccess: false,
          isError: true,
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
