/**
 * HealthCheck Reducers
 */
import { GET_HEALTH_CHECK, GET_HEALTH_CHECK_RESPONSE, RESET } from '../types'

/**
 * initial plugin state
 */
const INIT_STATE = {
  components: [],
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_HEALTH_CHECK:
      return {
        ...state,
        loading: true,
      }
    case GET_HEALTH_CHECK_RESPONSE:
      return {
        ...state,
        components: action.payload.components,
        loading: false,
      }
    case RESET:
      return {
        ...state,
        items: INIT_STATE.items,
        loading: INIT_STATE.loading,
      }
    default:
      return {
        ...state,
      }
  }
}
