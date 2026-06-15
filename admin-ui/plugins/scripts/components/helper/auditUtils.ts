import { logger } from '@/utils/logger'
import { createSuccessAuditInit, selectAuditContext } from '@/audit'
import { addAdditionalData, type AdditionalPayload } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { getRootState } from '@/redux/hooks'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'

export const logAuditAction = async (
  actionType: string,
  resource: string,
  data: AdditionalPayload,
): Promise<void> => {
  const audit = createSuccessAuditInit(selectAuditContext(getRootState()))

  addAdditionalData(audit, actionType, resource, data)

  try {
    await postUserAction(audit as UserActionPayload)
  } catch (error) {
    logger.error(
      `Audit logging failed for ${actionType}:`,
      error instanceof Error ? error : String(error),
    )
  }
}
