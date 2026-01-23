import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { UPDATE } from '@/audit/UserActionType'
import type { RootState } from '@/redux/sagas/types/audit'
import type { ModifiedFields } from '../types'

export function useConfigApiActions() {
  const authState = useSelector((state: RootState) => state.authReducer)
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logConfigApiUpdate = useCallback(
    async (message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        userinfo,
        action: UPDATE,
        resource: 'Config API configuration',
        message,
        modifiedFields,
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
