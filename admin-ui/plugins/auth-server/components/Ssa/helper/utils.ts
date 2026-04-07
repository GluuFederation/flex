import { getRootState } from 'Redux/hooks'
import { logAuditUserAction } from 'Utils/AuditLogger'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { CaughtError, ApiErrorLike } from '../types/ErrorTypes'
import type { SsaAuditLogPayload } from '../types/SsaFormTypes'
import { CREATE, DELETION } from '../../../../../app/audit/UserActionType'
import { SSA as SSA_RESOURCE } from '../../../redux/audit/Resources'

export const logSsaCreation = async (
  payload: SsaAuditLogPayload,
  message?: string,
): Promise<void> => {
  try {
    const state = getRootState()
    const authReducer = state.authReducer
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo

    await logAuditUserAction({
      userinfo,
      action: CREATE,
      resource: SSA_RESOURCE,
      message: message || 'SSA created successfully',
      client_id,
      payload: payload as unknown as JsonValue,
    })
  } catch (error) {
    console.error('Failed to log SSA creation:', error)
  }
}

export const logSsaDeletion = async (
  jti: string,
  payload?: SsaAuditLogPayload,
  message?: string,
): Promise<void> => {
  try {
    const state = getRootState()
    const authReducer = state.authReducer
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo

    await logAuditUserAction({
      userinfo,
      action: DELETION,
      resource: SSA_RESOURCE,
      message: message || 'SSA deleted successfully',
      client_id,
      payload: (payload || { jti }) as unknown as JsonValue,
    })
  } catch (error) {
    console.error('Failed to log SSA deletion:', error)
  }
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
