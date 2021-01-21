import {
  GET_ATTRIBUTES,
  GET_ATTRIBUTES_RESPONSE,
  SET_API_ERROR
} from "./types";

export const getAttributes = () => ({
  type: GET_ATTRIBUTES
});

export const getAttributesResponse = data => ({
   type: GET_ATTRIBUTES_RESPONSE,
   payload: { data }
});

export const setApiError = error => ({
  type: SET_API_ERROR,
  payload: { error }
});


