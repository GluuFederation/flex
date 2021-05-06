import {
  GET_LDAP,
  GET_LDAP_RESPONSE,
  SET_LDAP,
  PUT_LDAP,
  PUT_LDAP_RESPONSE,
  RESET,
  ADD_LDAP,
  ADD_LDAP_RESPONSE,
  DELETE_LDAP,
  DELETE_LDAP_RESPONSE,
  TEST_LDAP,
  TEST_LDAP_RESPONSE,
} from '../actions/types'

const INIT_STATE = {
  ldap: [],
  item: {},
  loading: false,
  testStatus: false,
}

const reducerName = 'ldapReducer';

export default function ldapReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_LDAP:
      return {
        ...state,
        loading: true,
      }
    case GET_LDAP_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          ldap: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case ADD_LDAP:
      return {
        ...state,
        loading: true,
      }

    case ADD_LDAP_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          ldap: [...state.ldap, action.payload.data],
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case SET_LDAP:
      return {
        ...state,
        item: action.payload.item,
        loading: false,
      }

    case PUT_LDAP:
      return {
        ...state,
        loading: true,
      }
    case PUT_LDAP_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          ldap: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }
    case DELETE_LDAP:
      return {
        ...state,
        loading: true,
      }

    case DELETE_LDAP_RESPONSE:
      if (action.payload.configId) {
        return {
          ...state,
          ldap: state.ldap.filter(
            (i) => i.configId !== action.payload.configId,
          ),
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case TEST_LDAP:
      return {
        ...state,
        loading: true,
      }

    case TEST_LDAP_RESPONSE:
      return {
        ...state,
        testStatus: !!action.payload.data,
        loading: false,
      }

    case RESET:
      return {
        ...state,
        ldap: INIT_STATE.ldap,
        loading: INIT_STATE.loading,
      }
    default:
      return {
        ...state,
      }
  }
}
