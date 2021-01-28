import {
  GET_CUSTOM_SCRIPT,
  GET_CUSTOM_SCRIPT_RESPONSE,
  SET_API_ERROR
} from "./types";

export const getCustomScripts = () => ({
  type: GET_CUSTOM_SCRIPT
});

export const getCustomScriptsResponse = data => ({
   type: GET_CUSTOM_SCRIPT_RESPONSE,
   payload: { data }
});

export const setApiError = error => ({
  type: SET_API_ERROR,
  payload: { error }
});


