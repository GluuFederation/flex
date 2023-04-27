import {
  GET_SMTPS,
  GET_SMTPS_RESPONSE,
  TEST_SMTP,
  TEST_SMTP_RESPONSE,
  UPDATE_SMTP,
  UPDATE_SMTP_RESPONSE,
} from '../actions/types'
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'

const INIT_STATE = {
  smtp: {},
  loading: true,
  testStatus: {}
}
const reducerName = 'smtpsReducer'

export default function smtpsReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_SMTPS:
      return {
        ...state,
        loading: true
      }

    case UPDATE_SMTP:
      return {
        ...state,
        loading: true,
      }
    case UPDATE_SMTP_RESPONSE:
      return {
        ...state,
        loading: false
      }

    case GET_SMTPS_RESPONSE:
      return {
        ...state,
        loading: false,
        smtp: action.payload ? action.payload : {},
      }

    case TEST_SMTP:
      return {
        ...state,
        loading: true,
      }

    case TEST_SMTP_RESPONSE:
        return {
          ...state,
          testStatus: action?.payload?.data || {},
          loading: false,
      }

    default:
      return handleDefault()
  }

  function handleDefault() {
    return {
      ...state,
    }
  }
}
reducerRegistry.register(reducerName, smtpsReducer)
