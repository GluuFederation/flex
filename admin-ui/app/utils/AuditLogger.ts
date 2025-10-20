import { addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import type { AuditLog } from 'Plugins/admin/redux/sagas/types'

export interface BasicUserInfo {
  inum?: string
  name?: string
}

export interface LogAuditParams {
  token?: string
  userinfo?: BasicUserInfo | null
  action: string
  resource: string
  message: string
  modifiedFields?: Record<string, unknown>
  performedOn?: string | Date
  ip_address?: string
  extra?: Record<string, unknown>
  status?: string
  client_id?: string
  payload?: unknown
}

export async function logAuditUserAction({
  token,
  userinfo,
  action,
  resource,
  message,
  modifiedFields = {},
  performedOn,
  extra = {},
  status = 'success',      
  client_id,
  ip_address,      
  payload,
}: LogAuditParams): Promise<void> {
  const audit: AuditLog = {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    status,
    performedBy: {
      user_inum: userinfo?.inum ?? '-',
      userId: userinfo?.name ?? '-',
    },
    client_id,
  }

  const payloadWrapper = {
    action: {
      action_message: message,
      action_data:
        payload !== undefined
          ? payload
          : {
              ...extra,
              modifiedFields,
              ...(performedOn ? { performedOn } : {}),
            },
    },
  }

  addAdditionalData(audit, action, resource, payloadWrapper)
  if (audit?.headers?.Authorization) {
    await postUserAction(audit)
  }
}

export const logAudit = logAuditUserAction
