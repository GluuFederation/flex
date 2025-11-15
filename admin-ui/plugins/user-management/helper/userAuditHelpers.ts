import store from 'Redux/store'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { FETCH, DELETION, UPDATE, CREATE } from '../../../app/audit/UserActionType'
import { API_USERS } from '../../../app/audit/Resources'
import { CustomUser } from '../types/UserApiTypes'

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

export interface AuditPayload extends CustomUser {
  modifiedFields?: Record<string, unknown>[]
  performedOn?: {
    user_inum?: string
    userId?: string
  }
  action_message?: string
  message?: string
  userPassword?: string
  userConfirmPassword?: string
  customAttributes?: Array<{ values?: unknown }>
  jsonPatchString?: string
}

/**
 * Initialize audit log with user information from Redux store
 */
export function initAudit(): AuditLog {
  const state = store.getState() as unknown as { authReducer: AuthState }
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

export async function logUserCreation(data: CustomUser, payload: CustomUser): Promise<void> {
  try {
    const state = store.getState() as unknown as { authReducer: AuthState }
    const authReducer: AuthState = state.authReducer
    const token = authReducer.token?.access_token || ''
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo

    const auditPayload: AuditPayload = { ...payload }
    if (auditPayload.userPassword) {
      auditPayload.userPassword = '[REDACTED]'
    }
    const extendedPayload = payload as AuditPayload
    if (extendedPayload.modifiedFields && !auditPayload.modifiedFields) {
      auditPayload.modifiedFields = extendedPayload.modifiedFields
    }
    if (extendedPayload.performedOn && !auditPayload.performedOn) {
      auditPayload.performedOn = extendedPayload.performedOn
    }

    const message = extendedPayload.action_message || extendedPayload.message || 'Created user'

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

export async function logUserUpdate(data: CustomUser, payload: CustomUser): Promise<void> {
  try {
    const state = store.getState() as unknown as { authReducer: AuthState }
    const authReducer: AuthState = state.authReducer
    const token = authReducer.token?.access_token || ''
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo
    const auditPayload: AuditPayload = { ...payload }
    delete auditPayload.userPassword
    delete auditPayload.userConfirmPassword
    if (auditPayload.customAttributes?.[0]) {
      delete auditPayload.customAttributes[0].values
    }
    const extendedPayload = payload as AuditPayload
    if (extendedPayload.modifiedFields && !auditPayload.modifiedFields) {
      auditPayload.modifiedFields = extendedPayload.modifiedFields
    }
    if (extendedPayload.performedOn && !auditPayload.performedOn) {
      auditPayload.performedOn = extendedPayload.performedOn
    }
    const message = extendedPayload.action_message || extendedPayload.message || 'Updated user'
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

export async function logUserDeletion(inum: string, userData?: CustomUser): Promise<void> {
  try {
    const state = store.getState() as unknown as { authReducer: AuthState }
    const authReducer: AuthState = state.authReducer
    const token = authReducer.token?.access_token || ''
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo
    const payload = userData || { inum }
    const extendedPayload = userData as AuditPayload | undefined
    const message = extendedPayload?.action_message || extendedPayload?.message || 'Deleted user'
    await logAuditUserAction({
      token,
      userinfo,
      action: DELETION,
      resource: API_USERS,
      message,
      client_id,
      payload,
    })
  } catch (error) {
    console.error('Failed to log user deletion:', error)
  }
}

export async function logUserFetch(payload: Record<string, unknown>): Promise<void> {
  try {
    const state = store.getState() as unknown as { authReducer: AuthState }
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

export async function logPasswordChange(
  inum: string,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    const state = store.getState() as unknown as { authReducer: AuthState }
    const authReducer: AuthState = state.authReducer
    const token = authReducer.token?.access_token || ''
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo
    const auditPayload: AuditPayload = { ...payload }
    if (auditPayload.jsonPatchString) {
      auditPayload.jsonPatchString =
        '[{"op":"replace","path":"/userPassword","value":"[REDACTED]"}]'
    }
    if (Array.isArray(payload)) {
      for (const op of payload) {
        if ((op as Record<string, unknown>).path === '/userPassword') {
          ;(op as Record<string, unknown>).value = '[REDACTED]'
        }
      }
    }
    if (auditPayload.customAttributes?.[0]) {
      delete auditPayload.customAttributes[0].values
    }
    const extendedPayload = payload as AuditPayload
    if (extendedPayload.modifiedFields && !auditPayload.modifiedFields) {
      auditPayload.modifiedFields = extendedPayload.modifiedFields
    }
    if (extendedPayload.performedOn && !auditPayload.performedOn) {
      auditPayload.performedOn = extendedPayload.performedOn
    }

    const message = extendedPayload.action_message || extendedPayload.message || 'Password changed'

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
    console.error('Failed to log password change:', error)
  }
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string
      description?: string
    }
    body?: {
      description?: string
      message?: string
    }
    text?: string
  }
  message?: string
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as ErrorResponse
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
