import { useMemo } from 'react'
import { getRootState, useAppSelector } from '@/redux/hooks'
import type { RootState } from '@/redux/types'
import type { AuditContext, AuditInit, CreateAuditInitOptions } from './types'

export const selectAuditContext = (state: RootState): AuditContext => ({
  client_id: state.authReducer?.config?.clientId || '',
  ip_address: state.authReducer?.location?.IPv4 || '',
  userinfo: state.authReducer?.userinfo,
})

export const getCurrentAuditContext = (): AuditContext => {
  return selectAuditContext(getRootState())
}

export const createSuccessAuditInit = (
  context: AuditContext,
  options: CreateAuditInitOptions = {},
): AuditInit => ({
  client_id: context.client_id,
  ip_address: context.ip_address,
  status: 'success',
  performedBy: {
    user_inum: context.userinfo?.inum ?? '-',
    userId: options.userId ?? context.userinfo?.name ?? context.userinfo?.user_name ?? '-',
  },
})

export const useAuditContext = (): AuditContext => {
  const client_id = useAppSelector((state) => state.authReducer?.config?.clientId || '')
  const ip_address = useAppSelector((state) => state.authReducer?.location?.IPv4 || '')
  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)

  return useMemo(
    () => ({
      client_id,
      ip_address,
      userinfo,
    }),
    [client_id, ip_address, userinfo],
  )
}
