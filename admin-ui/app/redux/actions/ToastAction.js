import {UPDATE_TOAST} from './types'

export const updateToast = (showToast = false, type = "success", message = "") =>  ({
    type:UPDATE_TOAST,
    payload:{
        showToast:showToast,
        message:message,
        type:type
    }
})