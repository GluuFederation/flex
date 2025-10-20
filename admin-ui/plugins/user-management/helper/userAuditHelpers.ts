import store from 'Redux/store'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { FETCH, DELETION, UPDATE, CREATE } from '../../../app/audit/UserActionType'
import { API_USERS } from '../../../app/audit/Resources'

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
    const state = store.getState() as any
    const authReducer: AuthState = state.authReducer
    const token = authReducer.token?.access_token || ''
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo

    const auditPayload = { ...payload }
    delete auditPayload.userPassword
    if (payload?.modifiedFields && !auditPayload.modifiedFields) {
      auditPayload.modifiedFields = payload.modifiedFields
    }
    if (payload?.performedOn && !auditPayload.performedOn) {
      auditPayload.performedOn = payload.performedOn
    }

    const message =
      payload?.action?.action_message ||
      payload?.action_message ||
      payload?.message ||
      'Created user'

    await logAuditUserAction({
      token,
      userinfo,
      action: CREATE,
      resource: API_USERS,
      message,
      client_id,
      payload: auditPayload,
    })
  } catch (error) {
    console.error('Failed to log user creation:', error)
  }
}

export async function logUserUpdate(data: any, payload: any): Promise<void> {
  try {
    const state = store.getState() as any
    const authReducer: AuthState = state.authReducer
    const token = authReducer.token?.access_token || ''
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo
    const auditPayload = { ...payload }
    delete auditPayload.userPassword
    delete auditPayload.userConfirmPassword
    if (auditPayload.customAttributes?.[0]) {
      delete auditPayload.customAttributes[0].values
    }
    if (payload?.modifiedFields && !auditPayload.modifiedFields) {
      auditPayload.modifiedFields = payload.modifiedFields
    }
    if (payload?.performedOn && !auditPayload.performedOn) {
      auditPayload.performedOn = payload.performedOn
    }
    const message =
      payload?.action?.action_message ||
      payload?.action_message ||
      payload?.message ||
      'Updated user'
    await logAuditUserAction({
      token,
      userinfo,
      action: UPDATE,
      resource: API_USERS,
      message,
      client_id,
      payload: auditPayload,
    })
  } catch (error) {
    console.error('Failed to log user update:', error)
  }
}

export async function logUserDeletion(inum: string, userData?: any): Promise<void> {
  try {
    const state = store.getState() as any
    const authReducer: AuthState = state.authReducer
    const token = authReducer.token?.access_token || ''
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo
    const payload = userData || { inum }
    await logAuditUserAction({
      token,
      userinfo,
      action: DELETION,
      resource: API_USERS,
      message: 'Deleted user',
      client_id,
      payload,
    })
  } catch (error) {
    console.error('Failed to log user deletion:', error)
  }
}

export async function logUserFetch(payload: any): Promise<void> {
  try {
    const state = store.getState() as any
    const authReducer: AuthState = state.authReducer
    const token = authReducer.token?.access_token || ''
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo

    await logAuditUserAction({
      token,
      userinfo,
      action: FETCH,
      resource: API_USERS,
      message: 'Fetched users',
      client_id,
      payload,
    })
  } catch (error) {
    console.error('Failed to log user fetch:', error)
  }
}

export async function logPasswordChange(inum: string, payload: any): Promise<void> {
  try {
    const state = store.getState() as any
    const authReducer: AuthState = state.authReducer
    const token = authReducer.token?.access_token || ''
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo
    const auditPayload = { ...payload }
    if (Array.isArray(auditPayload)) {
      for (const op of auditPayload) {
        if (op.path === '/userPassword') {
          op.value = '[REDACTED]'
        }
      }
    }
    if (auditPayload.customAttributes?.[0]) {
      delete auditPayload.customAttributes[0].values
    }
    if (payload?.modifiedFields && !auditPayload.modifiedFields) {
      auditPayload.modifiedFields = payload.modifiedFields
    }
    if (payload?.performedOn && !auditPayload.performedOn) {
      auditPayload.performedOn = payload.performedOn
    }

    await logAuditUserAction({
      token,
      userinfo,
      action: UPDATE,
      resource: API_USERS,
      message: 'Password changed',
      client_id,
      payload: auditPayload,
    })
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
