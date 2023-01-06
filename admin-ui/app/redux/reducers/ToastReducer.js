import { UPDATE_TOAST } from '../actions/types'
import reducerRegistry from './ReducerRegistry'
const INIT_STATE = {
  showToast:false,
  message:"",
  type:"success"
}

const reducerName = 'toastReducer'

export default function toastReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case UPDATE_TOAST:
      return {
        ...state,
        showToast:action.payload.showToast,
        message:action.payload.message,
        type:action.payload.type
      }
    default:
      return {
        ...state,
      }
  }
}
reducerRegistry.register(reducerName, toastReducer)
