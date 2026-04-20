import { getCurrentAuditContext } from '@/audit'
import { devLogger } from '@/utils/devLogger'
import { resolveApiErrorMessage } from '@/utils/apiErrorMessage'
import { logAuditUserAction } from 'Utils/AuditLogger'
import type { JsonObject } from 'Routes/Apps/Gluu/types/common'
import type { CaughtError } from '../types'
import type { SsaAuditLogPayload } from '../types'
import type { SsaFormValues } from '../types'
import { CREATE, DELETION } from '../../../../../app/audit/UserActionType'
import { SSA as SSA_RESOURCE } from '../../../redux/audit/Resources'

const toJsonObject = (input: object): JsonObject => JSON.parse(JSON.stringify(input)) as JsonObject

export const logSsaCreation = async (payload: SsaFormValues, message?: string): Promise<void> => {
  try {
    const { client_id, userinfo } = getCurrentAuditContext()

    const { expirationDate, ...rest } = payload
    const serialized: JsonObject = toJsonObject(rest)
    if (expirationDate) {
      serialized.expirationDate = expirationDate.toISOString()
    }

    await logAuditUserAction({
      userinfo,
      action: CREATE,
      resource: SSA_RESOURCE,
      message: message || 'SSA created successfully',
      client_id,
      payload: serialized,
    })
  } catch (error) {
    devLogger.error('Failed to log SSA creation:', error)
  }
}

export const logSsaDeletion = async (
  jti: string,
  payload?: SsaAuditLogPayload,
  message?: string,
): Promise<void> => {
  try {
    const { client_id, userinfo } = getCurrentAuditContext()

    await logAuditUserAction({
      userinfo,
      action: DELETION,
      resource: SSA_RESOURCE,
      message: message || 'SSA deleted successfully',
      client_id,
      payload: toJsonObject({ ...(payload || {}), jti }),
    })
  } catch (error) {
    devLogger.error('Failed to log SSA deletion:', error)
  }
}

export const getErrorMessage = (error: CaughtError): string => {
  return resolveApiErrorMessage(error)
}
