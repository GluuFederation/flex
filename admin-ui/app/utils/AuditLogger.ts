import { addAdditionalData, type AdditionalPayload } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export interface BasicUserInfo {
  inum?: string
  name?: string
}

export interface LogAuditParams {
  userinfo?: BasicUserInfo | null
  action: string
  resource: string
  message: string
  modifiedFields?: Record<string, JsonValue>
  performedOn?: string | Date
  ip_address?: string
  extra?: Record<string, JsonValue>
  status?: string
  client_id?: string
  payload?: object | string | number | boolean | null
}

export async function logAuditUserAction({
  userinfo,
  action,
  resource,
  message,
  modifiedFields = {},
  performedOn,
  extra = {},
  status = 'success',
  client_id,
  payload,
}: LogAuditParams): Promise<void> {
  const audit: Partial<UserActionPayload> &
    Record<string, JsonValue | undefined | { user_inum: string; userId: string }> = {
    status,
    performedBy: {
      user_inum: userinfo?.inum ?? '-',
      userId: userinfo?.name ?? '-',
    },
    client_id,
  }

  const actionData: Record<string, JsonValue> =
    typeof payload === 'object' && payload !== null && !Array.isArray(payload)
      ? (payload as Record<string, JsonValue>)
      : {
          ...extra,
          modifiedFields,
          ...(performedOn ? { performedOn: String(performedOn) } : {}),
        }

  const payloadWrapper: AdditionalPayload = {
    action: {
      action_message: message,
      action_data: actionData,
    },
  }

  addAdditionalData(audit, action, resource, payloadWrapper)
  await postUserAction(audit as UserActionPayload)
}

export const logAudit = logAuditUserAction
