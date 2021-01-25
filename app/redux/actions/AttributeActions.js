import {
  GET_ATTRIBUTES,
  GET_ATTRIBUTES_RESPONSE,
  ADD_ATTRIBUTE,
  ADD_ATTRIBUTE_RESPONSE,
  DELETE_ATTRIBUTE,
  DELETE_ATTRIBUTE_RESPONSE,
  SET_API_ERROR
} from "./types";

export const getAttributes = () => ({
  type: GET_ATTRIBUTES
});

export const getAttributesResponse = data => ({
  type: GET_ATTRIBUTES_RESPONSE,
  payload: { data }
});
export const addAttribute = data => ({
  type: ADD_ATTRIBUTE,
  payload: { data }
});
export const addAttributeResponse = data => ({
  type: ADD_ATTRIBUTE_RESPONSE,
  payload: { data }
});

export const deleteAttribute = inum => ({
  type: DELETE_ATTRIBUTE,
  payload: { inum }
});

export const deleteAttributeResponse = data => ({
  type: DELETE_ATTRIBUTE_RESPONSE,
  payload: { data }
});

export const setApiError = error => ({
  type: SET_API_ERROR,
  payload: { error }
});
