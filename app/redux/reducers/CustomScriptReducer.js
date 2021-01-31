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
  DELETE_CUSTOM_SCRIPT,
  DELETE_CUSTOM_SCRIPT_RESPONSE,
	RESET,
	SET_API_ERROR
} from "../actions/types";

const INIT_STATE = {
  items: [],
  loading: true,
  hasApiError: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {     
    case GET_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true
      };
    case GET_CUSTOM_SCRIPT_RESPONSE:
      return {
        ...state,
        items: action.payload.data,
        loading: false,
        hasApiError: false
      };      
    case ADD_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true
      };
    case ADD_CUSTOM_SCRIPT_RESPONSE:
      return {
        ...state,
        items: [...state.items, action.payload.data],
        loading: false,
        hasApiError: false
      };      
    case EDIT_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true
      };
    case EDIT_CUSTOM_SCRIPT_RESPONSE:
      return {
        ...state,
        items: [...state.items],
        loading: false,
        hasApiError: false
      };      
    case DELETE_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true
      }
    case DELETE_CUSTOM_SCRIPT_RESPONSE:
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
