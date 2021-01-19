import {
  GET_SCOPE_BY_INUM,
  GET_SCOPE_BY_INUM_RESPONSE,
  GET_SCOPES,
  GET_SCOPES_RESPONSE
} from "../actions/types";

const INIT_STATE = {
  items: [
    {
      dn: "inum=F0C4,ou=scopes,o=jans",
      inum: "F0C4",
      id: "openid",
      description: "Authenticate using OpenID Connect.",
      scopeType: "openid",
      defaultScope: true,
      attributes: { showInConfigurationEndpoint: true },
      umaType: false
    }
  ],
  item: {
    dn: "inum=F0C4,ou=scopes,o=jans",
    inum: "F0C4",
    id: "openid",
    description: "Authenticate using OpenID Connect.",
    scopeType: "openid",
    defaultScope: true,
    attributes: { showInConfigurationEndpoint: true },
    umaType: false
  },
  loading: true
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

    case GET_SCOPES:
      return {
        ...state,
        loading: true
      };
    case GET_SCOPES_RESPONSE:
      return { ...state, items: action.payload.data, loading: false };
    default:
      return {
        ...state
      };
  }
};
