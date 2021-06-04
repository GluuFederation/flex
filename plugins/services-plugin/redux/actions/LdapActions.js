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

export const getLdapConfig = (action) => ({
  type: GET_LDAP,
  payload: { action },
})

export const getLdapResponse = (data) => ({
  type: GET_LDAP_RESPONSE,
  payload: { data },
})

export const addLdap = (action) => ({
  type: ADD_LDAP,
  payload: { action },
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

export const testLdap = (action) => ({
  type: TEST_LDAP,
  payload: {action},
})

export const testLdapResponse = (data) => ({
  type: TEST_LDAP_RESPONSE,
  payload: { data },
})