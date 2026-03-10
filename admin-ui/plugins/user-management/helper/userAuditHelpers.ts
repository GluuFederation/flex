import { getRootState } from 'Redux/hooks'
import type { RootState } from 'Redux/types'
import { logAuditUserAction } from 'Utils/AuditLogger'
import type { CaughtError, ApiErrorLike } from '../types/ErrorTypes'
import { FETCH, DELETION, UPDATE, CREATE } from '../../../app/audit/UserActionType'
import { API_USERS } from '../../../app/audit/Resources'
import { CustomUser } from '../types/UserApiTypes'
import { USER_PASSWORD_ATTR } from '../common/Constants'

export interface AuditLog {
  client_id?: string
  ip_address?: string
  status?: string
  performedBy?: {
    user_inum: string
    userId: string
  }
  message?: string
}

const SENSITIVE_CUSTOM_ATTRS: string[] = [USER_PASSWORD_ATTR]

const isSensitiveCustomAttr = (name?: string): boolean => {
  return !!name && SENSITIVE_CUSTOM_ATTRS.includes(name)
}

export interface AuditPayload extends CustomUser {
  modifiedFields?: Record<string, string | string[] | boolean>
  performedOn?: {
    user_inum?: string
    userId?: string
  }
  action_message?: string
  message?: string
  userPassword?: string
  userConfirmPassword?: string
  jsonPatchString?: string
}

const redactSensitiveData = (payload: AuditPayload): void => {
  if (payload.userPassword) {
    payload.userPassword = '[REDACTED]'
  }
  if (payload.userConfirmPassword) {
    payload.userConfirmPassword = '[REDACTED]'
  }

  if (payload.jsonPatchString) {
    payload.jsonPatchString = '[{"op":"replace","path":"/userPassword","value":"[REDACTED]"}]'
  }

  if (payload.customAttributes && payload.customAttributes.length > 0) {
    payload.customAttributes = payload.customAttributes.map((attr) => {
      if (isSensitiveCustomAttr(attr.name)) {
        const redactedValues =
          attr.values && Array.isArray(attr.values)
            ? attr.values.map(() => ({ value: '[REDACTED]' }))
            : undefined
        return {
          ...attr,
          values: redactedValues,
        }
      }
      return attr
    }) as CustomUser['customAttributes']
  }
}

export const initAudit = (): AuditLog => {
  const state: RootState = getRootState()
  const authReducer = state.authReducer
  const auditlog: AuditLog = {}
  const client_id = authReducer.config?.clientId || ''
  const ip_address = authReducer.location?.IPv4 || ''
  const userinfo = authReducer.userinfo
  const author = (userinfo?.name ?? userinfo?.user_name) || '-'
  const inum = userinfo?.inum || '-'
  auditlog.client_id = client_id
  auditlog.ip_address = ip_address
  auditlog.status = 'success'
  auditlog.performedBy = { user_inum: String(inum), userId: String(author) }

  return auditlog
}

export const logUserCreation = async (data: CustomUser, payload: CustomUser): Promise<void> => {
  try {
    const state = getRootState()
    const authReducer = state.authReducer
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo

    const auditPayload: AuditPayload = { ...payload }
    redactSensitiveData(auditPayload)

    const message =
      (payload as AuditPayload).action_message ||
      (payload as AuditPayload).message ||
      'Created user'

    await logAuditUserAction({
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

export const logUserUpdate = async (data: CustomUser, payload: CustomUser): Promise<void> => {
  try {
    const state = getRootState()
    const authReducer = state.authReducer
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo

    const auditPayload: AuditPayload = { ...payload }
    redactSensitiveData(auditPayload)

    const message =
      (payload as AuditPayload).action_message ||
      (payload as AuditPayload).message ||
      'Updated user'

    await logAuditUserAction({
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

export const logUserDeletion = async (inum: string, userData?: CustomUser): Promise<void> => {
  try {
    const state = getRootState()
    const authReducer = state.authReducer
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo
    const payload = userData || { inum }
    const extendedPayload = userData as AuditPayload | undefined
    const message = extendedPayload?.action_message || extendedPayload?.message || 'Deleted user'
    await logAuditUserAction({
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

export const logUserFetch = async (
  payload: Record<string, string | string[] | boolean | object | object[]>,
): Promise<void> => {
  try {
    const state = getRootState()
    const authReducer = state.authReducer
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo

    await logAuditUserAction({
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

export const logPasswordChange = async (
  inum: string,
  payload: Record<string, string | string[] | boolean | object | object[]>,
): Promise<void> => {
  try {
    const state = getRootState()
    const authReducer = state.authReducer
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo

    const auditPayload: AuditPayload = { ...payload }
    redactSensitiveData(auditPayload)

    const message =
      (payload as AuditPayload).action_message ||
      (payload as AuditPayload).message ||
      'Password changed'

    await logAuditUserAction({
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

export interface ErrorResponse {
  response?: {
    status?: number
    data?: {
      message?: string
      description?: string
      error_description?: string
    }
    body?: {
      description?: string
      message?: string
      error_description?: string
    }
    text?: string
  }
  message?: string
}

const pickFirstString = (...values: Array<string | undefined>): string | undefined => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return undefined
}

export const getErrorMessage = (error: CaughtError): string => {
  if (typeof error === 'string') {
    return error
  }
  if (typeof error === 'object' && error !== null) {
    const err = error as ApiErrorLike
    const status = err.response?.status
    const data = err.response?.data
    const body = err.response?.body

    const description = pickFirstString(
      data?.description,
      data?.error_description,
      body?.description,
      body?.error_description,
    )

    const message = pickFirstString(data?.message, body?.message)

    if (status && status >= 400 && status < 500 && description) {
      return description
    }

    return message || description || err?.response?.text || err?.message || 'An error occurred'
  }
  return 'An error occurred'
}
