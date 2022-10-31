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
  SET_VIEW,
} from '../actions/types'
import reducerRegistry from 'Redux/reducers/ReducerRegistry'
const INIT_STATE = {
  items: [],
  loading: true,
  view: false,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
  totalItems: 0,
  entriesCount: 0,
  isSuccess: false,
  isError: false,
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
          items: action.payload.data.entries,
          loading: false,
          totalItems: action.payload.data.totalEntriesCount,
          entriesCount: action.payload.data.entriesCount,
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
          items: action.payload.data.entries,
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
          isSuccess: true,
          isError: false,
        }
      } else {
        return {
          ...state,
          loading: false,
          saveOperationFlag: true,
          errorInSaveOperationFlag: true,
          isSuccess: false,
          isError: true,
        }
      }

    case EDIT_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true,
        saveOperationFlag: false,
        errorInSaveOperationFlag: false,
        isSuccess: false,
        isError: false,
      }
    case EDIT_CUSTOM_SCRIPT_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          items: [...state.items],
          loading: false,
          saveOperationFlag: true,
          errorInSaveOperationFlag: false,
          isSuccess: true,
          isError: false,
        }
      } else {
        return {
          ...state,
          loading: false,
          saveOperationFlag: true,
          errorInSaveOperationFlag: true,
          isSuccess: false,
          isError: true,
        }
      }

    case DELETE_CUSTOM_SCRIPT:
      return {
        ...state,
        loading: true,
        isSuccess: false,
        isError: false,
      }
    case DELETE_CUSTOM_SCRIPT_RESPONSE:
      if (action.payload.inum) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.inum !== action.payload.inum,
          ),
          loading: false,
          isSuccess: true,
          isError: false,
        }
      } else {
        return handleDefault({
          isSuccess: false,
          isError: true,
        })
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
    default:
      return handleDefault()
  }

  function handleDefault(additionalParam) {
    return {
      ...state,
      ...additionalParam,
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
