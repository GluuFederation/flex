import { addAdditionalData, type AdditionalPayload } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import store from 'Redux/store'
import type { RootState, AuditLog } from 'Redux/sagas/types/audit'

const createAuditLog = (state: RootState): AuditLog | null => {
  const { userinfo, config, location } = state.authReducer

  if (!userinfo?.inum || !userinfo?.name) {
    console.warn('Cannot create audit log: Missing required auth data')
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
  const currentState = store.getState() as unknown as RootState
  const audit = createAuditLog(currentState)

  if (!audit) {
    return
  }

  addAdditionalData(audit, actionType, resource, data)

  const result = await postUserAction(audit)

  if (result === -1) {
    console.error(`Audit logging failed for ${actionType}: postUserAction returned -1`)
  }
}
