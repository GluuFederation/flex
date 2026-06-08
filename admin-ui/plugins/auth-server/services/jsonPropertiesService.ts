import { addAdditionalData, isFourZeroThreeError } from 'Utils/TokenController'
import type { AdditionalPayload } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
import { FETCH, PATCH, DELETION, createSuccessAuditInit, getCurrentAuditContext } from '@/audit'
import type { AuditLog, AuditRecord } from 'Redux/types/audit'
import type { UserAction } from 'Utils/PermChecker'
import type { JsonPatch } from 'JansConfigApi'
import type { AppConfiguration } from '../components/AuthServerProperties/types'
import { JSON_CONFIG } from '../redux/audit/Resources'
import { enhanceJsonConfigAuditPayload } from '../redux/utils/auditHelpers'
import { callFetchJsonProperties, callPatchJsonProperties } from '../api/jsonPropertiesClient'
import { redirectSessionExpired } from '../utils/sessionExpiredRedirect'
import { logger } from '@/utils/logger'
import { resolveApiErrorMessage } from '@/utils/apiErrorMessage'

const createAuditLog = (): AuditLog => {
  return createSuccessAuditInit(getCurrentAuditContext()) as AuditLog
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
    logger.error('both', 'Failed to fetch auth server JSON properties: ' + resolveApiErrorMessage(e as Error))
    await handleForbidden(e as HttpErrorLike)
    throw e
  }
}

interface PatchActionData {
  deletedMapping?: boolean
  requestBody?: JsonPatch[]
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
    const patches = actionData?.requestBody ?? []
    const data = await callPatchJsonProperties(patches)
    await postUserAction(audit as UserActionPayload)
    return data
  } catch (e) {
    logger.error('both', 'Failed to patch auth server JSON properties: ' + resolveApiErrorMessage(e as Error))
    await handleForbidden(e as HttpErrorLike)
    throw e
  }
}
