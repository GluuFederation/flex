import {
  GET_ATTRIBUTES,
  GET_ATTRIBUTES_RESPONSE,
  ADD_ATTRIBUTE,
  ADD_ATTRIBUTE_RESPONSE,
  RESET,
  SET_API_ERROR,
  DELETE_ATTRIBUTE,
  DELETE_ATTRIBUTE_RESPONSE
} from "../actions/types";

const INIT_STATE = {
  items: [],
  loading: true,
  hasApiError: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ATTRIBUTES:
      return {
        ...state,
        loading: true
      };
    case GET_ATTRIBUTES_RESPONSE:
      return {
        ...state,
        items: action.payload.data,
        loading: false,
        hasApiError: false
      };
    case ADD_ATTRIBUTE:
      return {
        ...state,
        loading: true
      };
    case ADD_ATTRIBUTE_RESPONSE:
      return {
        ...state,
        items: [...state.items, action.payload.data],
        loading: false,
        hasApiError: false
      };

    case DELETE_ATTRIBUTE:
      return {
        ...state,
        loading: true
      };
    case DELETE_ATTRIBUTE_RESPONSE:
      return {
        ...state,
        items: state.items.filter(item => item.inum !== action.payload.data)
      };
    case SET_API_ERROR:
      return { ...state, loading: false, hasApiError: true };
    case RESET:
      return {
        ...state,
        items: INIT_STATE.items,
        loading: INIT_STATE.loading,
        hasApiError: INIT_STATE.hasApiError
      };
    default:
      return {
        ...state
      };
  }
};
