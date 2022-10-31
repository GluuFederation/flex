/* eslint-disable no-case-declarations */
import {
  GET_MAPPING,
  GET_MAPPING_RESPONSE,
  UPDATE_MAPPING,
  ADD_PERMISSIONS_TO_ROLE,
  UPDATE_PERMISSIONS_LOADING,
  RESET,
  UPDATE_PERMISSIONS_SERVER_RESPONSE,
} from '../actions/types'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const INIT_STATE = {
  items: [],
  serverItems: [],
  loading: false,
  isSuccess: false,
  isError: false,
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
      const roleIndex = state.items.findIndex(
        (element) => element.role == userRole,
      )
      const existingPermissions = state.items[roleIndex].permissions
      const newArr = existingPermissions.concat(data)
      const addedPermissions = state.items
      addedPermissions[roleIndex].permissions = newArr
      return {
        ...state,
        items: [...addedPermissions],
      }
    case UPDATE_PERMISSIONS_LOADING:
      return {
        ...state,
        loading: action.payload.data,
        isSuccess: false,
        isError: false,
      }
    case UPDATE_PERMISSIONS_SERVER_RESPONSE:
      const indexToUpdatePermissions = state.items.findIndex(
        (element) => element.role == action.payload?.data?.role,
      )
      const changedData = state.items
      changedData[indexToUpdatePermissions] = action.payload.data
      return {
        ...state,
        items: [...changedData],
        loading: false,
        isSuccess: true,
        isError: false,
      }
    case UPDATE_MAPPING:
      const { id, role } = action.payload.data
      const index = state.items.findIndex((element) => element.role == role)
      const permissions = state.items[index].permissions
      permissions.splice(id, 1)
      const changedPermissions = state.items
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
