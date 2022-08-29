import {
  GET_SESSIONS,
  GET_SESSIONS_RESPONSE,
  REVOKE_SESSION,
  REVOKE_SESSION_RESPONSE,
  RESET
} from './types'

export const getSessions = (action) => ({
  type: GET_SESSIONS,
  payload: { action },
})

export const getSessionsResponse = (data) => ({
  type: GET_SESSIONS_RESPONSE,
  payload: { data },
})

export const revokeSessions = (action) => ({
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
