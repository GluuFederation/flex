import {
  GET_DEFAULT_AUTHN,
  SET_LDAP_AUTH_ACR_RESPONSE,
  SET_SIMPLE_AUTH_ACR_RESPONSE,
  SET_SCRIPT_ACR_RESPONSE,
  PUT_LDAP_AUTH_ACR,
  PUT_SCRIPT_ACR,
  PUT_SIMPLE_AUTH_ACR,
  SET_SQL,
  SET_SUCCESS,
} from "../actions/types"

const INIT_STATE = {
  acrs: [
    {
      name: "simple_password_auth",
      level: "-1",
      description: "Built-in default password authentication",
      samlACR:
        "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
      primaryKey: "uid",
      passwordAttribute: "userPassword",
      hashAlgorithm: "bcrypt",
      defaultAuthNMethod: false,
      acrName: "simple_password_auth",
    },
  ],
  item: {},
  loading: false,
  acrAUTHReponse: {},
  isSuccess: false,
}

export default function authNReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_DEFAULT_AUTHN:
      return {
        ...state,
        loading: true,
      }

    case SET_SQL:
      return {
        ...state,
        item: action.payload.item,
      }

    case PUT_SIMPLE_AUTH_ACR:
      return {
        ...state,
        loading: true,
      }

    case SET_SIMPLE_AUTH_ACR_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          acrAUTHReponse: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case PUT_LDAP_AUTH_ACR:
      return {
        ...state,
        loading: true,
      }

    case SET_LDAP_AUTH_ACR_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          acrAUTHReponse: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case PUT_SCRIPT_ACR:
      return {
        ...state,
        loading: true,
      }

    case SET_SCRIPT_ACR_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          acrAUTHReponse: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case SET_SUCCESS:
      return { ...state, isSuccess: action.payload.data }

    default:
      return handleDefault()
  }

  function handleDefault() {
    return {
      ...state,
      loading: false,
    }
  }
}
