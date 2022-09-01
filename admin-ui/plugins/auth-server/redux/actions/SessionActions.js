import {
  GET_SESSIONS,
  GET_SESSIONS_RESPONSE,
  REVOKE_SESSION,
  REVOKE_SESSION_RESPONSE,
  RESET
} from './types'

export const getSessions = () => ({
  type: GET_SESSIONS,
  payload: { },
})

export const getSessionsResponse = (data) => ({
  type: GET_SESSIONS_RESPONSE,
  payload: { data },
})

export const revokeSession = (action) => ({
  type: REVOKE_SESSION,
  payload: { action },
})

export const revokeSessionsResponse = (data) => ({
  type: REVOKE_SESSION_RESPONSE,
  payload: { data },
})

export const resetSessions = () => ({
  type: RESET,
  payload: {},
})
