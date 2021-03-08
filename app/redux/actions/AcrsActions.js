import {
  GET_ACRS,
  GET_ACRS_RESPONSE,
  PUT_ACRS,
  PUT_ACRS_RESPONSE,
} from './types';
  
export const getAcrsConfig = () => ({
  type: GET_ACRS,
});
  
export const getAcrsResponse = (data) => ({
  type: GET_ACRS_RESPONSE,
  payload: { data },
});
  
export const editAcrs = (data) => ({
  type: PUT_ACRS,
  payload: { data },
});
export const editAcrsResponse = (data) => ({
  type: PUT_ACRS_RESPONSE,
  payload: { data },
});
