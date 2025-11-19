import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { UPDATE } from '@/audit/UserActionType'
import { JSON_CONFIG } from '../../../../redux/audit/Resources.js'
import type { ApiAppConfiguration } from 'JansConfigApi'
import type { RootState } from '@/redux/sagas/types/audit'

export interface ModifiedFields {
  [key: string]: unknown
}

export function useConfigApiActions() {
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logConfigApiUpdate = useCallback(
    async (config: ApiAppConfiguration, message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: UPDATE,
        resource: 'Config API configuration',
        message,
        modifiedFields,
        performedOn: 'config-api',
        client_id,
        payload: modifiedFields,
      })
    },
    [token, userinfo, client_id],
  )

  return {
    logConfigApiUpdate,
  }
}
