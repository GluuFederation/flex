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
  status?: string
  client_id?: string
  ip_address?: string
  payload?: unknown
}

export async function logAuditUserAction({
  token,
  userinfo,
  action,
  resource,
  message,
  modifiedFields,
  performedOn: _performedOn,
  status = 'success',
  client_id,
  ip_address,
  payload,
}: LogAuditParams): Promise<void> {
  // Construct audit object in the exact sequence specified
  const audit: AuditLog = {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    client_id,
    ip_address,
    status,
    performedBy: {
      user_inum: userinfo?.inum ?? '-',
      userId: userinfo?.name ?? '-',
    },
    action,
    resource,
    message,
  }

  // Add modifiedFields if provided
  if (modifiedFields && Object.keys(modifiedFields).length > 0) {
    audit.modifiedFields = modifiedFields
  }

  // Add payload if provided
  if (payload !== undefined && payload !== null) {
    audit.payload = payload as Record<string, unknown>
  }

  // Add date at the end
  audit.date = new Date()

  // Send the audit log
  if (audit?.headers?.Authorization) {
    await postUserAction(audit)
  }
}

export const logAudit = logAuditUserAction
