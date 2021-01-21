import {
  GET_SCOPE_BY_INUM,
  GET_SCOPE_BY_INUM_RESPONSE,
  GET_SCOPES,
  GET_SCOPES_RESPONSE,
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
    case GET_SCOPE_BY_INUM:
      return {
        ...state,
        loading: true
      };

    case GET_SCOPE_BY_INUM_RESPONSE:
      return {
        ...state,
        currentScope: action.payload.data,
        loading: false,
        hasApiError: false
      };

    case GET_SCOPES:
      return {
        ...state,
        loading: true
      };
    case GET_SCOPES_RESPONSE:
      return {
        ...state,
        items: action.payload.data,
        loading: false,
        hasApiError: false
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
