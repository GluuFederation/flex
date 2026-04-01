import { addAdditionalData, isFourZeroThreeError } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
import { FETCH, PATCH, DELETION } from '@/audit/UserActionType'
import { getRootState } from '@/redux/hooks'
import type { AuditLog } from 'Redux/sagas/types/audit'
import type { UserAction } from 'Utils/PermChecker'
import { JSON_CONFIG } from '../redux/audit/Resources'
import { enhanceJsonConfigAuditPayload } from '../redux/utils/auditHelpers'
import { callFetchJsonProperties, callPatchJsonProperties } from '../api/jsonPropertiesClient'
import { redirectSessionExpired } from '../utils/sessionExpiredRedirect'
import type { AgamaJsonPatch } from '../components/Agama/types/agamaTypes'

function createAuditLog(): AuditLog {
  const state = getRootState()
  const authReducer = state.authReducer
  const auditlog: AuditLog = {}
  auditlog.client_id = authReducer.config?.clientId || ''
  auditlog.ip_address = authReducer.location?.IPv4 || ''
  auditlog.status = 'success'
  const userinfo = authReducer.userinfo
  auditlog.performedBy = {
    user_inum: userinfo?.inum ?? '-',
    userId: userinfo?.name ?? '-',
  }
  return auditlog
}

type HttpErrorLike = Parameters<typeof isFourZeroThreeError>[0]

async function handleForbidden(e: unknown): Promise<void> {
  if (isFourZeroThreeError(e as HttpErrorLike)) {
    await redirectSessionExpired()
  }
}

/**
 * Fetches auth server JSON configuration and records the same audit entry as the former JSON config saga.
 */
export async function fetchAuthServerJsonProperties(): Promise<Record<string, unknown>> {
  const audit = createAuditLog()
  addAdditionalData(
    audit as Record<string, string | number | boolean | object | null | undefined>,
    FETCH,
    JSON_CONFIG,
    {},
  )
  try {
    const data = (await callFetchJsonProperties()) as Record<string, unknown>
    await postUserAction(audit as UserActionPayload)
    return data
  } catch (e) {
    await handleForbidden(e)
    throw e
  }
}

/**
 * PATCHes auth server JSON configuration and records audit (and relies on the caller for toast UX via React Query).
 */
export async function patchAuthServerJsonProperties(userAction: UserAction): Promise<unknown> {
  const audit = createAuditLog()
  const payload = { action: userAction }
  const enhancedPayload = enhanceJsonConfigAuditPayload(payload, JSON_CONFIG)
  const actionData = userAction.action_data as
    | {
        deletedMapping?: unknown
        requestBody?: AgamaJsonPatch[]
      }
    | undefined
  const hasDeletedMapping = Boolean(actionData?.deletedMapping)
  const hasRemovePatch =
    Array.isArray(actionData?.requestBody) &&
    actionData.requestBody.some((patch) => patch.op === 'remove')
  const isDeleteOperation = hasDeletedMapping || hasRemovePatch
  const actionType = isDeleteOperation ? DELETION : PATCH
  addAdditionalData(
    audit as Record<string, string | number | boolean | object | null | undefined>,
    actionType,
    JSON_CONFIG,
    enhancedPayload as unknown as Record<string, unknown>,
  )
  try {
    const data = await callPatchJsonProperties(userAction.action_data)
    await postUserAction(audit as UserActionPayload)
    return data
  } catch (e) {
    await handleForbidden(e)
    throw e
  }
}
