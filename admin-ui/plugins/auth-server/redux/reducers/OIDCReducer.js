import {
  GET_OPENID_CLIENTS,
  GET_OPENID_CLIENTS_RESPONSE,
  ADD_NEW_CLIENT,
  ADD_CLIENT_RESPONSE,
  EDIT_CLIENT,
  EDIT_CLIENT_RESPONSE,
  DELETE_CLIENT,
  DELETE_CLIENT_RESPONSE,
  SET_CLIENT_ITEM,
  RESET,
  SEARCH_CLIENTS,
  SET_VIEW,
  GET_UMA_RESOURCES,
  GET_UMA_RESOURCES_RESPONSE
} from '../actions/types'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'

const INIT_STATE = {
  items: [],
  item: {},
  view: false,
  loading: false,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
  umaResources: {},
}

const reducerName = 'oidcReducer'

export default function oidcReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_OPENID_CLIENTS:
      return handleLoading()
    case SEARCH_CLIENTS:
      return handleLoading()
    case GET_OPENID_CLIENTS_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case ADD_NEW_CLIENT:
      return {
        ...state,
        loading: true,
        saveOperationFlag: false,
        errorInSaveOperationFlag: false,
      }
    case ADD_CLIENT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items],
          loading: false,
          saveOperationFlag: true,
          errorInSaveOperationFlag: false,
        }
      } else {
        return {
          ...state,
          loading: false,
          saveOperationFlag: true,
          errorInSaveOperationFlag: true,
        }
      }

    case EDIT_CLIENT:
      return {
        ...state,
        loading: true,
        items: [],
        saveOperationFlag: false,
        errorInSaveOperationFlag: false,
      }
    case EDIT_CLIENT_RESPONSE:
      if (action.payload.data) {
        const clients = state.items.filter(
          (e) => e.inum !== action.payload.data.inum,
        )

        return {
          ...state,
          items: [action.payload.data, ...clients],
          loading: false,
          saveOperationFlag: true,
          errorInSaveOperationFlag: false,
        }
      } else {
        return {
          ...state,
          loading: false,
          saveOperationFlag: true,
          errorInSaveOperationFlag: true,
        }
      }

    case DELETE_CLIENT:
      return handleLoading()

    case DELETE_CLIENT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: state.items.filter((i) => i.inum !== action.payload.data),
          loading: false,
        }
      } else {
        return handleDefault()
      }

    case SET_CLIENT_ITEM:
      return {
        ...state,
        item: action.payload.item,
        loading: false,
      }
    case SET_VIEW:
      if (action.payload) {
        return {
          ...state,
          view: action.payload.view,
          loading: false,
        }
      } else {
        return handleDefault()
      }
    case GET_UMA_RESOURCES: 
      return handleLoading()

    case GET_UMA_RESOURCES_RESPONSE: 
      if (action.payload.data) {
        console.log('action', action)
        return {
          ...state,
          umaResources: action.payload.data,
          loading: false,
        }
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

  function handleDefault() {
    return {
      ...state,
      loading: false,
      saveOperationFlag: false,
      errorInSaveOperationFlag: false,
    }
  }
  function handleLoading() {
    return {
      ...state,
      loading: true,
      saveOperationFlag: false,
      errorInSaveOperationFlag: false,
    }
  }
}
reducerRegistry.register(reducerName, oidcReducer)