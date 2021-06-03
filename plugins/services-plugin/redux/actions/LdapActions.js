import {
  GET_LDAP,
  GET_LDAP_RESPONSE,
  PUT_LDAP,
  PUT_LDAP_RESPONSE,
  ADD_LDAP,
  ADD_LDAP_RESPONSE,
  DELETE_LDAP,
  DELETE_LDAP_RESPONSE,
  SET_LDAP,
  TEST_LDAP,
  TEST_LDAP_RESPONSE,
} from './types'

export const getLdapConfig = () => ({
  type: GET_LDAP,
})

export const getLdapResponse = (data) => ({
  type: GET_LDAP_RESPONSE,
  payload: { data },
})

export const addLdap = (script) => ({
  type: ADD_LDAP,
  payload: { script },
})

export const addLdapResponse = (data) => ({
  type: ADD_LDAP_RESPONSE,
  payload: { data },
})

export const editLdap = (action) => ({
  type: PUT_LDAP,
  payload: { action },
})

export const editLdapResponse = (data) => ({
  type: PUT_LDAP_RESPONSE,
  payload: { data },
})

export const deleteLdap = (action) => ({
  type: DELETE_LDAP,
  payload: { action },
})

export const deleteLdapResponse = (configId) => ({
  type: DELETE_LDAP_RESPONSE,
  payload: { configId },
})

export const setCurrentItem = (item) => ({
  type: SET_LDAP,
  payload: { item },
})

export const testLdap = (data) => ({
  type: TEST_LDAP,
  payload: {data},
})

export const testLdapResponse = (data) => ({
  type: TEST_LDAP_RESPONSE,
  payload: { data },
})