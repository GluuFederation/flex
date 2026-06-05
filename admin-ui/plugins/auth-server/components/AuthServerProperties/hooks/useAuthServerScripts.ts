import { useEffect, useMemo, useRef } from 'react'
import { useGetConfigScripts } from 'JansConfigApi'
import { useAppSelector } from '@/redux/hooks'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { devLogger } from '@/utils/devLogger'
import { isScriptEntry } from '../Properties/utils'
import { FETCH_SCRIPTS_FOR_STAT, SCRIPT } from '@/audit'
import type { GenericItem } from 'Redux/types'
import type { Script } from '../types'

export const useAuthServerScripts = (): Script[] => {
  const clientId = useAppSelector((state) => state.authReducer?.config?.clientId)
  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)

  const { data, isSuccess } = useGetConfigScripts()

  const scripts = useMemo<Script[]>(
    () => ((data?.entries ?? []) as GenericItem[]).filter(isScriptEntry),
    [data],
  )

  const auditedRef = useRef(false)
  useEffect(() => {
    if (!isSuccess || auditedRef.current) {
      return
    }
    auditedRef.current = true
    void logAuditUserAction({
      userinfo,
      client_id: clientId,
      action: FETCH_SCRIPTS_FOR_STAT,
      resource: SCRIPT,
      message: '',
    }).catch((error) =>
      devLogger.error(
        '[AuthServer scripts audit] failed',
        error instanceof Error ? error : String(error),
      ),
    )
  }, [isSuccess, userinfo, clientId])

  return scripts
}
