import {
  GET_SMTP,
  GET_SMTP_RESPONSE,
  SET_SMTP,
  SET_SMTP_RESPONSE,
  PUT_SMTP,
  PUT_SMTP_RESPONSE,
  TEST_SMTP,
  TEST_SMTP_RESPONSE,
  RESET,
} from '../actions/types'

const INIT_STATE = {
  smtp: {},
  loading: false,
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SMTP:
      return {
        ...state,
        loading: true,
      }
    case GET_SMTP_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          smtp: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case SET_SMTP:
      return {
        ...state,
        loading: true,
      }
    case SET_SMTP_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          smtp: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case PUT_SMTP:
      return {
        ...state,
        loading: true,
      }
    case PUT_SMTP_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          smtp: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case TEST_SMTP:
      return {
        ...state,
        loading: true,
      }

    case TEST_SMTP_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          loading: false,
        }
      }
      return {
        ...state,
      }

    case RESET:
      return {
        ...state,
        smtp: INIT_STATE.smtp,
        loading: INIT_STATE.loading,
      }
    default:
      return {
        ...state,
      }
  }
}
