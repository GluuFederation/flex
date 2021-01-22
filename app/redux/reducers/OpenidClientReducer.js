import {
  GET_OPENID_CLIENTS,
  GET_OPENID_CLIENTS_RESPONSE,
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
     
    case GET_OPENID_CLIENTS:
      return {
        ...state,
        loading: true
      };
    case GET_OPENID_CLIENTS_RESPONSE:
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
