import React from 'react'
import { Dayjs } from 'dayjs'

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
  [key: string]: any
}

export interface RootState {
  cedarPermissions?: {
    permissions: string[]
  }
}

export interface SessionListPageProps {
  row?: Session
}

export interface SessionDetailPageProps {
  row: Session
}

export interface TableColumn {
  title: string
  field: string
  render?: (rowData: Session) => React.ReactNode
}

export interface FilterState {
  limit: number
  pattern: string | null
  searchFilter: string | null
  date: Dayjs | null
}

export interface ColumnState {
  checkedColumns: string[]
  updatedColumns: TableColumn[]
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
