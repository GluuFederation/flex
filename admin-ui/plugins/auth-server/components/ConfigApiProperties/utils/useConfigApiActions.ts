import { useCallback } from 'react'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { UPDATE } from '@/audit/UserActionType'
import { CONFIG_API_CONFIGURATION } from '@/audit/Resources'
import { useAppSelector } from '@/redux/hooks'
import type { JsonValue } from 'Routes/Apps/Gluu/types/index'
import type { ModifiedFields } from '../types'

export const useConfigApiActions = () => {
  const authState = useAppSelector((state) => state.authReducer)
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logConfigApiUpdate = useCallback(
    async (message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        userinfo,
        action: UPDATE,
        resource: CONFIG_API_CONFIGURATION,
        message,
        modifiedFields: modifiedFields as Record<string, JsonValue> | undefined,
        performedOn: 'config-api',
        client_id,
      })
    },
    [userinfo, client_id],
  )

  return {
    logConfigApiUpdate,
  }
}
