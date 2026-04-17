import { getRootState } from 'Redux/hooks'
import { devLogger } from '@/utils/devLogger'
import { logAuditUserAction } from 'Utils/AuditLogger'
import type { JsonObject } from 'Routes/Apps/Gluu/types/common'
import type { CaughtError, ApiErrorLike } from '../types'
import type { SsaAuditLogPayload } from '../types'
import type { SsaFormValues } from '../types'
import { CREATE, DELETION } from '../../../../../app/audit/UserActionType'
import { SSA as SSA_RESOURCE } from '../../../redux/audit/Resources'

const toJsonObject = (input: object): JsonObject => JSON.parse(JSON.stringify(input)) as JsonObject

export const logSsaCreation = async (payload: SsaFormValues, message?: string): Promise<void> => {
  try {
    const state = getRootState()
    const authReducer = state.authReducer
    const client_id = authReducer.config?.clientId || ''
    const userinfo = authReducer.userinfo

    const { expirationDate, ...rest } = payload
    const serialized: JsonObject = toJsonObject(rest)
    if (expirationDate) {
      serialized.expirationDate = expirationDate.toISOString()
    }

    await logAuditUserAction({
      userinfo,
      action: CREATE,
      resource: SSA_RESOURCE,
      message: message || 'SSA created successfully',
      client_id,
      payload: serialized,
    })
  } catch (error) {
    devLogger.error('Failed to log SSA creation:', error)
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
      payload: toJsonObject({ ...(payload || {}), jti }),
    })
  } catch (error) {
    devLogger.error('Failed to log SSA deletion:', error)
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
    const trimmed = error.trim()
    if (trimmed.length > 0) {
      return trimmed
    }
    return 'An error occurred'
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
