/**
 * Helper functions for user management audit logging and webhooks
 * These functions replace the saga-based audit logging with React Query mutation callbacks
 */

import store from 'Redux/store'
import { addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { FETCH, DELETION, UPDATE, CREATE } from '../../../app/audit/UserActionType'
import { API_USERS } from '../../../app/audit/Resources'

// Types
export interface AuditLog {
  headers: {
    Authorization?: string
  }
  client_id?: string
  ip_address?: string
  status?: string
  performedBy?: {
    user_inum: string
    userId: string
  }
  message?: string
}

export interface AuthState {
  token: {
    access_token: string
  }
  issuer: string
  userinfo_jwt: string
  config: {
    clientId: string
  }
  location: {
    IPv4: string
  }
  userinfo: {
    name: string
    inum: string
  }
}

/**
 * Initialize audit log with user information from Redux store
 */
export function initAudit(): AuditLog {
  const state = store.getState() as any
  const authReducer: AuthState = state.authReducer
  const auditlog: AuditLog = {
    headers: {},
  }
  const client_id = authReducer.config?.clientId || ''
  const ip_address = authReducer.location?.IPv4 || ''
  const userinfo = authReducer.userinfo
  const author = userinfo ? userinfo.name : '-'
  const inum = userinfo ? userinfo.inum : '-'
  const token = authReducer.token?.access_token || ''
  auditlog.client_id = client_id
  auditlog.ip_address = ip_address
  auditlog.status = 'success'
  auditlog.performedBy = { user_inum: inum, userId: author }
  auditlog.headers.Authorization = `Bearer ${token}`

  return auditlog
}

export async function logUserCreation(data: any, payload: any): Promise<void> {
  try {
    const audit = initAudit()
    const auditPayload = { ...payload }
    delete auditPayload.userPassword // Don't log passwords
    addAdditionalData(audit, CREATE, API_USERS, auditPayload)
    await postUserAction(audit)
  } catch (error) {
    console.error('Failed to log user creation:', error)
  }
}

export async function logUserUpdate(data: any, payload: any): Promise<void> {
  try {
    const audit = initAudit()
    const auditPayload = { ...payload }
    if (auditPayload.customAttributes && auditPayload.customAttributes[0]) {
      delete auditPayload.customAttributes[0].values
    }
    addAdditionalData(audit, UPDATE, API_USERS, auditPayload)
    await postUserAction(audit)
  } catch (error) {
    console.error('Failed to log user update:', error)
  }
}

export async function logUserDeletion(inum: string, userData?: any): Promise<void> {
  try {
    const audit = initAudit()
    const payload = userData || { inum }
    addAdditionalData(audit, DELETION, API_USERS, payload)
    await postUserAction(audit)
  } catch (error) {
    console.error('Failed to log user deletion:', error)
  }
}

export async function logUserFetch(payload: any): Promise<void> {
  try {
    const audit = initAudit()
    addAdditionalData(audit, FETCH, API_USERS, payload)
    audit.message = 'Fetched users'
    await postUserAction(audit)
  } catch (error) {
    console.error('Failed to log user fetch:', error)
  }
}

export async function logPasswordChange(inum: string, payload: any): Promise<void> {
  try {
    const audit = initAudit()
    const auditPayload = { ...payload }
    if (auditPayload.customAttributes && auditPayload.customAttributes[0]) {
      delete auditPayload.customAttributes[0].values
    }
    addAdditionalData(audit, UPDATE, API_USERS, auditPayload)
    await postUserAction(audit)
  } catch (error) {
    console.error('Failed to log password change:', error)
  }
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as any
    return (
      err?.response?.data?.message ||
      err?.response?.data?.description ||
      err?.response?.body?.description ||
      err?.response?.body?.message ||
      err?.response?.text ||
      err?.message ||
      'An error occurred'
    )
  }
  return 'An unknown error occurred'
}
