import type { ThemeConfig } from '@/context/theme/config'

export type CedarlingConfigPageStyleParams = {
  themeColors: ThemeConfig
  isDark: boolean
}

export type PolicyStoreConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onClose: () => void
}
