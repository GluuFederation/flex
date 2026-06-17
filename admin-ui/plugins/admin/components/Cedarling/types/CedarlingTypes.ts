import type { ThemeConfig } from '@/context/theme/config'

export type CedarlingConfigPageStyleParams = {
  themeColors: ThemeConfig
  isDark: boolean
}

export type PolicyStoreUploadConfirmDialogProps = {
  open: boolean
  onConfirm: () => void
  onClose: () => void
}
