import { logAuditUserAction } from 'Utils/AuditLogger'
import { createSuccessAuditInit, getCurrentAuditContext, DELETION, UPDATE, CREATE } from '@/audit'
import { resolveApiErrorMessage } from '@/utils/apiErrorMessage'
import { triggerWebhookForFeature } from '@/utils/triggerWebhookForFeature'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { AuditLog, AuditPayload, CaughtError } from '../types'
import { API_USERS } from '../../../app/audit/Resources'
import { CustomUser } from '../types'
import { USER_PASSWORD_ATTR } from '../common'
import { devLogger } from '@/utils/devLogger'

export type { AuditLog, AuditPayload }

const SENSITIVE_CUSTOM_ATTRS: string[] = [USER_PASSWORD_ATTR]

const isSensitiveCustomAttr = (name?: string): boolean => {
  return !!name && SENSITIVE_CUSTOM_ATTRS.includes(name)
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
  const context = getCurrentAuditContext()
  return createSuccessAuditInit(context, {
    userId: (context.userinfo?.name ?? context.userinfo?.user_name) || '-',
  }) as AuditLog
}

export const logUserCreation = async (_data: CustomUser, payload: CustomUser): Promise<void> => {
  try {
    const { client_id, userinfo } = getCurrentAuditContext()

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
    devLogger.error('Failed to log user creation:', error instanceof Error ? error : String(error))
  }
}

export const logUserUpdate = async (_data: CustomUser, payload: CustomUser): Promise<void> => {
  try {
    const { client_id, userinfo } = getCurrentAuditContext()

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
    devLogger.error('Failed to log user update:', error instanceof Error ? error : String(error))
  }
}

export const logUserDeletion = async (inum: string, userData?: CustomUser): Promise<void> => {
  try {
    const { client_id, userinfo } = getCurrentAuditContext()
    const auditPayload: AuditPayload = { inum, ...(userData || {}) }
    redactSensitiveData(auditPayload)
    const message =
      (userData as AuditPayload | undefined)?.action_message ||
      (userData as AuditPayload | undefined)?.message ||
      'Deleted user'
    await logAuditUserAction({
      userinfo,
      action: DELETION,
      resource: API_USERS,
      message,
      client_id,
      payload: auditPayload,
    })
  } catch (error) {
    devLogger.error('Failed to log user deletion:', error instanceof Error ? error : String(error))
  }
}

export const logPasswordChange = async (
  _inum: string,
  payload: Record<string, string | string[] | boolean | object | object[]>,
): Promise<void> => {
  try {
    const { client_id, userinfo } = getCurrentAuditContext()

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
    devLogger.error(
      'Failed to log password change:',
      error instanceof Error ? error : String(error),
    )
  }
}

export type { ErrorResponse } from '../types'

export const getErrorMessage = (error: CaughtError): string => {
  return resolveApiErrorMessage(error, {
    trimString: false,
    emptyStringFallback: false,
  })
}

export const triggerUserWebhook = (
  data: CustomUser,
  feature: string = adminUiFeatures.users_edit,
): void => {
  triggerWebhookForFeature(data as Record<string, JsonValue>, feature)
}
