import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
import { addAdditionalData } from 'Utils/TokenController'
import { CREATE, UPDATE, DELETION, FETCH } from '@/audit/UserActionType'
import { devLogger } from '@/utils/devLogger'
import type {
  AssetAuditActionData,
  AssetAuditActionType,
  AssetAuditInit,
  AssetAuditLogActionPayload,
  AssetAuditRootState,
} from '../types'

const MAX_STRING_LENGTH = 500
const MAX_DEPTH = 5

function sanitizeValue(value: unknown, depth: number): unknown {
  if (depth > MAX_DEPTH) return '[REDACTED]'
  if (value === null || value === undefined) return value
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (value instanceof File) return { type: 'file', name: value.name, size: value.size } as const
  if (value instanceof Blob) return { type: 'blob', size: value.size } as const
  if (typeof value === 'string')
    return value.length > MAX_STRING_LENGTH
      ? `${value.slice(0, MAX_STRING_LENGTH)}... [truncated]`
      : value
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item, depth + 1))
  if (typeof value === 'object' && value !== null) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = sanitizeValue(v, depth + 1)
    return out
  }
  return '[REDACTED]'
}

function sanitizeActionData(
  data: Record<string, unknown> | null | undefined,
): AssetAuditActionData | undefined {
  if (data === null || data === undefined) return undefined
  const sanitized = sanitizeValue(data, 0)
  return typeof sanitized === 'object' && sanitized !== null && !Array.isArray(sanitized)
    ? (sanitized as AssetAuditActionData)
    : undefined
}

export const useAssetAudit = () => {
  const clientId = useSelector((state: AssetAuditRootState) => state.authReducer.config.clientId)
  const ipAddress = useSelector((state: AssetAuditRootState) => state.authReducer.location.IPv4)
  const userinfo = useSelector((state: AssetAuditRootState) => state.authReducer.userinfo)

  const initAudit = useCallback(
    (): AssetAuditInit => ({
      client_id: clientId,
      ip_address: ipAddress,
      status: 'success',
      performedBy: {
        user_inum: userinfo?.inum || '-',
        userId: userinfo?.name || '-',
      },
    }),
    [clientId, ipAddress, userinfo],
  )

  const logAction = useCallback(
    async (
      actionType: AssetAuditActionType,
      resource: string,
      payload: AssetAuditLogActionPayload,
    ) => {
      const audit = initAudit()
      const sanitizedActionData = sanitizeActionData(
        payload.action_data as Record<string, unknown> | null | undefined,
      )
      addAdditionalData(audit, actionType, resource, {
        action: {
          action_message: payload.action_message,
          action_data: sanitizedActionData,
        },
      })
      try {
        await postUserAction(audit as UserActionPayload)
      } catch (err) {
        devLogger.error('[Asset audit] postUserAction failed', err)
      }
    },
    [initAudit],
  )

  return { initAudit, logAction }
}

export { CREATE, UPDATE, DELETION, FETCH }
