export const SESSION_STATES = ['authenticated', 'unauthenticated'] as const
export const [AUTHENTICATED_SESSION_STATE, UNAUTHENTICATED_SESSION_STATE] = SESSION_STATES

export interface SessionAttributes {
  auth_user: string
  remote_ip: string
  client_id: string
  acr_values: string
  sid?: string
  [key: string]: string | undefined
}

export interface Session {
  id?: string
  userDn?: string
  authenticationTime: string
  state: SessionState
  sessionState?: string
  sessionAttributes: SessionAttributes
  expirationDate?: Date | string
  permissionGrantedMap?: Record<string, boolean>
}

export interface SessionDetailPageProps {
  row: Session
}

export type SessionState = (typeof SESSION_STATES)[number]

export type SearchFilterType =
  | 'client_id'
  | 'auth_user'
  | 'expirationDate'
  | 'authenticationTime'
  | null

export type MutationCallbacks = {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export type AuditContext = {
  userinfo: { inum?: string; name?: string } | null | undefined
  client_id: string | undefined
}

// Constants
export const DOC_CATEGORY = 'sessions' as const
