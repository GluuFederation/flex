import { devLogger } from '@/utils/devLogger'
import { createSuccessAuditInit, selectAuditContext } from '@/audit'
import { addAdditionalData, type AdditionalPayload } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { getRootState, type RootState } from '@/redux/hooks'
import type { AuditLog } from 'Redux/sagas/types'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'

const createAuditLog = (state: RootState): AuditLog | null => {
  const { userinfo } = state.authReducer

  if (!userinfo?.inum || !userinfo?.name) {
    devLogger.warn('Cannot create audit log: Missing required auth data')
    return null
  }

  return createSuccessAuditInit(selectAuditContext(state))
}

export const logAuditAction = async (
  actionType: string,
  resource: string,
  data: AdditionalPayload,
): Promise<void> => {
  const currentState = getRootState()
  const audit = createAuditLog(currentState)

  if (!audit) {
    return
  }

  addAdditionalData(audit, actionType, resource, data)

  try {
    await postUserAction(audit as UserActionPayload)
  } catch (error) {
    devLogger.error(
      `Audit logging failed for ${actionType}:`,
      error instanceof Error ? error : String(error),
    )
  }
}
