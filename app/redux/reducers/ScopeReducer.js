import {
  GET_SCOPES,
  GET_SCOPES_RESPONSE,
  DELETE_SCOPE,
  DELETE_SCOPE_RESPONSE,
  GET_SCOPE_BY_INUM,
  GET_SCOPE_BY_INUM_RESPONSE
} from "../actions/types";

const INIT_STATE = {
  scopes: [],
  loading: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SCOPES:
      return {
        ...state,
        loading: true
      };
    case GET_SCOPES_RESPONSE:
      return { ...state, scopes: action.payload.data, loading: false };
    default:
      return {
        ...state
      };
  }
};
