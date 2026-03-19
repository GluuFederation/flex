import { devLogger } from '@/utils/devLogger'
import { addAdditionalData, type AdditionalPayload } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { getRootState, type RootState } from '@/redux/hooks'
import type { AuditLog } from 'Redux/sagas/types/audit'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'

const createAuditLog = (state: RootState): AuditLog | null => {
  const { userinfo, config, location } = state.authReducer

  if (!userinfo?.inum || !userinfo?.name) {
    devLogger.warn('Cannot create audit log: Missing required auth data')
    return null
  }

  return {
    status: 'success',
    performedBy: {
      user_inum: userinfo.inum,
      userId: userinfo.name,
    },
    client_id: config?.clientId,
    ip_address: location?.IPv4,
  }
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

  addAdditionalData(
    audit as Record<string, string | number | boolean | object | null | undefined>,
    actionType,
    resource,
    data,
  )

  try {
    await postUserAction(audit as UserActionPayload)
  } catch (error) {
    devLogger.error(`Audit logging failed for ${actionType}:`, error)
  }
}
