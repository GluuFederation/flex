import type { ThemeConfig } from '@/context/theme/config'

export type CedarlingConfigPageStyleParams = {
  themeColors: ThemeConfig
  isDark: boolean
}

/** Which action a pending discard confirmation belongs to: leaving the page, or clearing edits in place. */
export type ArchiveDiscardIntent = 'back' | 'reset'

export type PolicyStoreConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onClose: () => void
}
