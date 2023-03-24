import {
    GET_AGAMA,
    GET_AGAMA_RESPONSE
  } from '../actions/types'
  
  const INIT_STATE = {
    agamaList: [],
    loading: true,
    totalItems: 0,
    entriesCount: 0,
  }
  
  const reducerName = 'agamaReducer'
  
  export default function agamaReducer(state = INIT_STATE, action) {
    switch (action.type) {
      case GET_AGAMA:
        return {
          ...state,
          loading: true,
        }
      case GET_AGAMA_RESPONSE:
        if (action.payload) {
          return {
            ...state,
            loading:false,
            totalItems:action.payload?.totalEntriesCount || 0,
            entriesCount:action.payload?.entriesCount || 0,
            agamaList:action.payload?.entries || []
          }
        } else {
          return handleDefault()
        }
      default:
        return handleDefault()
    }
  
    function handleDefault() {
      return {
        ...state,
        loading: false,
      }
    }
  }
  