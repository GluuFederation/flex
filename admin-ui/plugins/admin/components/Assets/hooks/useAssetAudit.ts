import { useCallback } from 'react'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
import { addAdditionalData } from 'Utils/TokenController'
import { createSuccessAuditInit, useAuditContext, CREATE, UPDATE, DELETION, FETCH } from '@/audit'
import { devLogger } from '@/utils/devLogger'
import type { JsonObject } from 'Routes/Apps/Gluu/types/common'
import type {
  AssetAuditActionData,
  AssetAuditActionType,
  AssetAuditInit,
  AssetAuditLogActionPayload,
  SanitizableValue,
  SanitizedValue,
} from '../types'

const MAX_STRING_LENGTH = 500
const MAX_DEPTH = 5

const sanitizeValue = (value: SanitizableValue, depth: number): SanitizedValue => {
  if (depth > MAX_DEPTH) return '[REDACTED]'
  if (value === null || value === undefined) return value
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (value instanceof File) return { type: 'file', name: value.name, size: value.size }
  if (value instanceof Blob) return { type: 'blob', size: value.size }
  if (typeof value === 'string')
    return value.length > MAX_STRING_LENGTH
      ? `${value.slice(0, MAX_STRING_LENGTH)}... [truncated]`
      : value
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item as SanitizableValue, depth + 1) ?? null)
  }
  if (typeof value === 'object') {
    const out: JsonObject = {}
    for (const [k, v] of Object.entries(value)) {
      const sanitized = sanitizeValue(v as SanitizableValue, depth + 1)
      if (sanitized !== undefined) out[k] = sanitized
    }
    return out
  }
  return '[REDACTED]'
}

const sanitizeActionData = (
  data: AssetAuditLogActionPayload['action_data'],
): AssetAuditActionData | undefined => {
  if (data === null || data === undefined) return undefined
  const sanitized = sanitizeValue(data as JsonObject, 0)
  return typeof sanitized === 'object' && sanitized !== null && !Array.isArray(sanitized)
    ? (sanitized as AssetAuditActionData)
    : undefined
}

export const useAssetAudit = () => {
  const auditContext = useAuditContext()

  const initAudit = useCallback(
    (): AssetAuditInit => createSuccessAuditInit(auditContext) as AssetAuditInit,
    [auditContext],
  )

  const logAction = useCallback(
    async (
      actionType: AssetAuditActionType,
      resource: string,
      payload: AssetAuditLogActionPayload,
    ) => {
      const audit = initAudit()
      const sanitizedActionData = sanitizeActionData(payload.action_data)
      addAdditionalData(audit, actionType, resource, {
        action: {
          action_message: payload.action_message,
          action_data: sanitizedActionData,
        },
      })
      try {
        await postUserAction(audit as UserActionPayload)
      } catch (err) {
        devLogger.error(
          '[Asset audit] postUserAction failed',
          err instanceof Error ? err : String(err),
        )
      }
    },
    [initAudit],
  )

  return { initAudit, logAction }
}

export { CREATE, UPDATE, DELETION, FETCH }
