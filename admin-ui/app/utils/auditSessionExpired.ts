import { auditLogoutLogs } from '@/redux/features/sessionSlice'
import { SESSION_EXPIRED } from '@/audit/messages'
import type { AppDispatch } from '@/redux/hooks'

const auditSessionExpired = (dispatch: AppDispatch, message = SESSION_EXPIRED): void => {
  dispatch(auditLogoutLogs({ message }))
}

export default auditSessionExpired
