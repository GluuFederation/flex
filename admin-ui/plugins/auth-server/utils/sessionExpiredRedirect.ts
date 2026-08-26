import store from '@/redux/store'
import auditSessionExpired from '@/utils/auditSessionExpired'
import { SESSION_EXPIRED } from '@/audit/messages'

export const redirectSessionExpired = (message = SESSION_EXPIRED): void => {
  auditSessionExpired(store.dispatch, message)
}
