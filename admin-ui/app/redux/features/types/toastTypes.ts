export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastState {
  showToast: boolean
  message: string
  type: ToastType
}
