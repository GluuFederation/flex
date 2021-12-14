import { GET_MAPPING, GET_MAPPING_RESPONSE, RESET } from '../actions/types'
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'

const INIT_STATE = {
  items: [],
  loading: false,
}
const reducerName = 'apiMappingReducer'

export default function apiMappingReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_MAPPING:
      console.log("==================>")
      return handleLoading()
    case GET_MAPPING_RESPONSE:
      if (action.payload.data) {
        return handleItems()
      } else {
        return handleDefault()
      }

    case RESET:
      return {
        ...state,
        items: INIT_STATE.items,
        loading: INIT_STATE.loading,
      }
    default:
      return handleDefault()
  }

  function handleItems() {
    return {
      ...state,
      items: action.payload.data,
      loading: false,
    }
  }

  function handleLoading() {
    return {
      ...state,
      loading: true,
    }
  }

  function handleDefault() {
    return {
      ...state,
      loading: false,
    }
  }
}
reducerRegistry.register(reducerName, apiMappingReducer)
