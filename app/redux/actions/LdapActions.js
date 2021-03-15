import {
  GET_LDAP,
  GET_LDAP_RESPONSE,
  PUT_LDAP,
  PUT_LDAP_RESPONSE,
} from './types'

export const getLdapConfig = () => ({
  type: GET_LDAP,
})

export const getLdapResponse = (data) => ({
  type: GET_LDAP_RESPONSE,
  payload: { data },
})

export const editLdap = (data) => ({
  type: PUT_LDAP,
  payload: { data },
})
export const editLdapResponse = (data) => ({
  type: PUT_LDAP_RESPONSE,
  payload: { data },
})
