import type { ThemeConfig } from '@/context/theme/config'

export type CedarlingConfigPageStyleParams = {
  themeColors: ThemeConfig
  isDark: boolean
}

export type ArchiveAddFileDialogProps = {
  open: boolean
  existingPaths: readonly string[]
  onAdd: (path: string) => void
  onClose: () => void
}

export type PolicyStoreConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onClose: () => void
}
