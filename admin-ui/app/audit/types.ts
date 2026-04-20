import type { RootState } from '@/redux/types'

export type AuditContext = {
  client_id: string
  ip_address: string
  userinfo: RootState['authReducer']['userinfo']
}

export type AuditInit = {
  client_id: string
  ip_address: string
  status: 'success'
  performedBy: {
    user_inum: string
    userId: string
  }
}

export type CreateAuditInitOptions = {
  userId?: string
}
