import {
  GET_MAPPING,
  GET_MAPPING_RESPONSE,
  UPDATE_MAPPING,
  RESET,
} from '../actions/types'
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'

const INIT_STATE = {
  items: [],
  loading: false,
}
const reducerName = 'mappingReducer'

export default function mappingReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_MAPPING:
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
    case UPDATE_MAPPING:
      const { id, role } = action.payload.data
      let index = state.items.findIndex((element) => element.role == role)
      let permissions = state.items[index].permissions
      permissions.splice(id, 1)
      let changedPermissions = state.items
      changedPermissions[index].permissions = permissions
      return {
        ...state,
        items: [...changedPermissions],
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
reducerRegistry.register(reducerName, mappingReducer)
