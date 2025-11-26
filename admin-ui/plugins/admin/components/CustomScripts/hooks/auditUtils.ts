import { addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import store from 'Redux/store'
import type { RootState, AuditLog } from 'Redux/sagas/types/audit'

const createAuditLog = (state: RootState): AuditLog | null => {
  const { token, userinfo, config, location } = state.authReducer

  if (!token?.access_token || !userinfo?.inum || !userinfo?.name) {
    console.warn('Cannot create audit log: Missing required auth data')
    return null
  }

  return {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
    status: 'success',
    performedBy: {
      user_inum: userinfo.inum,
      userId: userinfo.name,
    },
    client_id: config?.clientId,
    ip_address: location?.IPv4,
  }
}

type AdditionalPayload = Record<string, unknown> & {
  action?: {
    action_message?: string
    action_data?: Record<string, unknown>
  }
  action_message?: string
  message?: string
  modifiedFields?: unknown
  performedOn?: unknown
  tableData?: unknown
  omitPayload?: boolean
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

  try {
    await postUserAction(audit)
  } catch (e) {
    console.error(`Audit logging failed for ${actionType}:`, e)
  }
}
