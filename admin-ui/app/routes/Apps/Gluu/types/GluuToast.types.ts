import type { ToastMessage, ToastType } from '@/redux/types'

export type ToastItem = {
  id: string
  type: ToastType
  message: ToastMessage
  onClose?: () => void
  exiting?: boolean
}
