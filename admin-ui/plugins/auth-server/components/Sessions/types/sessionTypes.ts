// Core Session Types
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
  state: 'authenticated' | 'unauthenticated'
  sessionState?: string
  sessionAttributes: SessionAttributes
  expirationDate?: Date | string
  permissionGrantedMap?: Record<string, boolean>
}

export interface SessionDetailPageProps {
  row: Session
}

export type SessionState = 'authenticated' | 'unauthenticated'

export type SearchFilterType =
  | 'client_id'
  | 'auth_user'
  | 'expirationDate'
  | 'authenticationTime'
  | null

// Constants
export const DOC_CATEGORY = 'sessions' as const
