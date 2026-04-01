import { addAdditionalData, isFourZeroThreeError } from 'Utils/TokenController'
import type { AdditionalPayload } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
import { FETCH, PATCH, DELETION } from '@/audit/UserActionType'
import { getRootState } from '@/redux/hooks'
import type { AuditLog, AuditRecord } from 'Redux/sagas/types'
import type { UserAction } from 'Utils/PermChecker'
import type { JsonPatch } from 'JansConfigApi'
import type { AppConfiguration } from '../components/AuthServerProperties/types'
import { JSON_CONFIG } from '../redux/audit/Resources'
import { enhanceJsonConfigAuditPayload } from '../redux/utils/auditHelpers'
import { callFetchJsonProperties, callPatchJsonProperties } from '../api/jsonPropertiesClient'
import { redirectSessionExpired } from '../utils/sessionExpiredRedirect'
import type { AgamaJsonPatch } from '../components/Agama/types/agamaTypes'

const createAuditLog = (): AuditLog => {
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

const handleForbidden = async (e: HttpErrorLike): Promise<void> => {
  if (isFourZeroThreeError(e)) {
    await redirectSessionExpired()
  }
}

export const fetchAuthServerJsonProperties = async (): Promise<AppConfiguration> => {
  const audit = createAuditLog()
  addAdditionalData(audit as AuditRecord, FETCH, JSON_CONFIG, {})
  try {
    const data = await callFetchJsonProperties()
    await postUserAction(audit as UserActionPayload)
    return data
  } catch (e) {
    await handleForbidden(e as HttpErrorLike)
    throw e
  }
}

interface PatchActionData {
  deletedMapping?: boolean
  requestBody?: AgamaJsonPatch[]
}

export const patchAuthServerJsonProperties = async (
  userAction: UserAction,
): Promise<AppConfiguration> => {
  const audit = createAuditLog()
  const payload = { action: userAction }
  const enhancedPayload = enhanceJsonConfigAuditPayload(payload, JSON_CONFIG)
  const actionData = userAction.action_data as PatchActionData | undefined
  const hasDeletedMapping = Boolean(actionData?.deletedMapping)
  const hasRemovePatch =
    Array.isArray(actionData?.requestBody) &&
    actionData.requestBody.some((patch) => patch.op === 'remove')
  const isDeleteOperation = hasDeletedMapping || hasRemovePatch
  const actionType = isDeleteOperation ? DELETION : PATCH
  addAdditionalData(audit as AuditRecord, actionType, JSON_CONFIG, {
    action: enhancedPayload.action,
  } as AdditionalPayload)
  try {
    const patches = (actionData?.requestBody ?? []).map((p) => ({
      op: p.op,
      path: p.path,
      ...(p.value !== undefined ? { value: p.value } : {}),
    })) as JsonPatch[]
    const data = await callPatchJsonProperties(patches)
    await postUserAction(audit as UserActionPayload)
    return data
  } catch (e) {
    await handleForbidden(e as HttpErrorLike)
    throw e
  }
}
