import {
  GET_ACRS_RESPONSE,
  GET_DEFAULT_AUTHN,
  PUT_ACRS,
  SET_SQL,
  PUT_SIMPLE_AUTH_ACR,
  PUT_LDAP_AUTH_ACR,
  PUT_SCRIPT_ACR,
  SET_SIMPLE_AUTH_ACR_RESPONSE,
  SET_LDAP_AUTH_ACR_RESPONSE,
  SET_SCRIPT_ACR_RESPONSE,
  SET_SUCCESS,
} from "./types";

export const getDefaultAuthn = () => ({
  type: GET_DEFAULT_AUTHN,
});

export const setCurrentItem = (item) => ({
  type: SET_SQL,
  payload: { item },
});

export const setSimpleAuthAcrResponse = (data) => ({
  type: SET_SIMPLE_AUTH_ACR_RESPONSE,
  payload: { data },
});

export const setLDAPAuthAcrResponse = (data) => ({
  type: SET_LDAP_AUTH_ACR_RESPONSE,
  payload: { data },
});

export const setScriptAuthAcrResponse = (data) => ({
  type: SET_SCRIPT_ACR_RESPONSE,
  payload: { data },
});

export const editSimpleAuthAcr = (data) => ({
  type: PUT_SIMPLE_AUTH_ACR,
  payload: { data },
});

export const editLDAPAuthAcr = (data) => ({
  type: PUT_LDAP_AUTH_ACR,
  payload: { data },
});

export const editScriptAuthAcr = (data) => ({
  type: PUT_SCRIPT_ACR,
  payload: { data },
});

export const setSuccess = (data) => ({
  type: SET_SUCCESS,
  payload: { data },
});
