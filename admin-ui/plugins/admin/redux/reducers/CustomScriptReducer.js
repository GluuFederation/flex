import {
  GET_CUSTOM_SCRIPT,
  GET_CUSTOM_SCRIPT_RESPONSE,
  GET_CUSTOM_SCRIPT_BY_TYPE,
  GET_CUSTOM_SCRIPT_BY_TYPE_RESPONSE,
  ADD_CUSTOM_SCRIPT,
  ADD_CUSTOM_SCRIPT_RESPONSE,
  EDIT_CUSTOM_SCRIPT,
  EDIT_CUSTOM_SCRIPT_RESPONSE,
  SET_SCRIPT_ITEM,
  DELETE_CUSTOM_SCRIPT,
  DELETE_CUSTOM_SCRIPT_RESPONSE,
  RESET,
} from '../actions/types'
import reducerRegistry from '../../../../app/redux/reducers/ReducerRegistry'
const INIT_STATE = {
  items: [],
  loading: true,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
}

const reducerName = 'customScriptReducer'

export default function customScriptReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_CUSTOM_SCRIPT:
      return handleLoading()
    case GET_CUSTOM_SCRIPT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }
    case GET_CUSTOM_SCRIPT_BY_TYPE:
      return handleLoading()
    case GET_CUSTOM_SCRIPT_BY_TYPE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: action.payload.data,
          loading: false,
        }
      } else {
        return handleDefault()
      }
    case ADD_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true,
        saveOperationFlag: false,
        errorInSaveOperationFlag: false,
      }
    case ADD_CUSTOM_SCRIPT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items, action.payload.data],
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

    case EDIT_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true,
        saveOperationFlag: false,
        errorInSaveOperationFlag: false,
      }
    case EDIT_CUSTOM_SCRIPT_RESPONSE:
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

    case DELETE_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true,
      }
    case DELETE_CUSTOM_SCRIPT_RESPONSE:
      if (action.payload.inum) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.inum !== action.payload.inum,
          ),
          loading: false,
        }
      } else {
        return handleDefault()
      }
    case SET_SCRIPT_ITEM:
      return {
        ...state,
        item: action.payload.item,
        loading: false,
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
reducerRegistry.register(reducerName, customScriptReducer)
