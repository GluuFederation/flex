import {
  GET_SCOPE_BY_INUM,
  GET_SCOPE_BY_INUM_RESPONSE
} from "../actions/types";

const INIT_STATE = {
  scopes: [],
  currentScope: null,
  loading: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SCOPE_BY_INUM:
      return {
        ...state,
        loading: true
      };

    case GET_SCOPE_BY_INUM_RESPONSE:
      return { ...state, currentScope: action.payload.data, loading: false };
    default:
      return {
        ...state
      };
  }
};
