import {
  GET_MAPPING,
  GET_MAPPING_RESPONSE,
  UPDATE_MAPPING,
  ADD_PERMISSIONS_TO_ROLE,
  UPDATE_PERMISSIONS_LOADING,
  RESET,
  UPDATE_PERMISSIONS_SERVER_RESPONSE,
} from '../actions/types'
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'

const INIT_STATE = {
  items: [],
  serverItems: [],
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
    case ADD_PERMISSIONS_TO_ROLE:
      const { data, userRole } = action.payload.data
      let roleIndex = state.items.findIndex(
        (element) => element.role == userRole,
      )
      let existingPermissions = state.items[roleIndex].permissions
      let newArr = existingPermissions.concat(data)
      let addedPermissions = state.items
      addedPermissions[roleIndex].permissions = newArr
      return {
        ...state,
        items: [...addedPermissions],
      }
    case UPDATE_PERMISSIONS_LOADING:
      return {
        ...state,
        loading: action.payload.data,
      }
    case UPDATE_PERMISSIONS_SERVER_RESPONSE:
      let indexToUpdatePermissions = state.items.findIndex(
        (element) => element.role == action.payload?.data?.role,
      )
      let changedData = state.items
      changedData[indexToUpdatePermissions] = action.payload.data
      return {
        ...state,
        items: [...changedData],
        loading: false,
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
reducerRegistry.register(reducerName, mappingReducer)
