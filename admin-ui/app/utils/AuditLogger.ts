import { addAdditionalData, type AdditionalPayload } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { BasicUserInfo, LogAuditParams } from './types'

export type { BasicUserInfo, LogAuditParams }

export const logAuditUserAction = async ({
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
}: LogAuditParams): Promise<void> => {
  const audit: Partial<UserActionPayload> &
    Record<string, JsonValue | undefined | { user_inum: string; userId: string }> = {
    status,
    performedBy: {
      user_inum: userinfo?.inum ?? '-',
      userId: userinfo?.name ?? '-',
    },
    client_id,
  }

  const normalizedModifiedFields: Record<string, JsonValue> = modifiedFields
    ? (JSON.parse(JSON.stringify(modifiedFields)) as Record<string, JsonValue>)
    : {}

  const actionData: Record<string, JsonValue> =
    typeof payload === 'object' && payload !== null && !Array.isArray(payload)
      ? (payload as Record<string, JsonValue>)
      : {
          ...extra,
          modifiedFields: normalizedModifiedFields,
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
