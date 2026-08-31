import type { ThemeConfig } from '@/context/theme/config'
import type { ArchiveTreeNode } from '@/utils/cjarArchive'

export type CedarlingConfigPageStyleParams = {
  themeColors: ThemeConfig
  isDark: boolean
}

type ArchivePathDialogMode = 'file' | 'folder' | 'rename'

export type ArchivePathDialogProps = {
  open: boolean
  mode: ArchivePathDialogMode
  existingPaths: readonly string[]
  initialPath?: string
  onSubmit: (path: string) => void
  onClose: () => void
}

export type ArchivePathDialogState = {
  mode: ArchivePathDialogMode
  initialPath?: string
}

type ArchiveFileTreeClasses = {
  treeRow: string
  treeRowSelected: string
  treeRowName: string
  treeRowCount: string
  treeRowActions: string
  treeRowAction: string
  treeSectionLabel: string
  treeIcon: string
  treeFileIcon: string
  paneActionIcon: string
}

export type ArchiveFileTreeProps = {
  nodes: readonly ArchiveTreeNode[]
  selectedPath: string | null
  onSelect: (path: string) => void
  classes: ArchiveFileTreeClasses
  canEdit?: boolean
  onRename?: (path: string) => void
  onDelete?: (path: string) => void
  renameLabel: string
  deleteLabel: string
  rootLabel?: string
  depth?: number
}

export type ArchiveDirectoryProps = Omit<ArchiveFileTreeProps, 'nodes' | 'rootLabel' | 'depth'> & {
  node: ArchiveTreeNode
  canEdit: boolean
  depth: number
}

export type ArchiveFileProps = Omit<
  ArchiveFileTreeProps,
  'nodes' | 'selectedPath' | 'rootLabel' | 'depth'
> & {
  node: ArchiveTreeNode
  isSelected: boolean
  canEdit: boolean
  depth: number
}

export type ArchiveRowActionsProps = {
  path: string
  name: string
  classes: ArchiveFileTreeClasses
  onRename?: (path: string) => void
  onDelete?: (path: string) => void
  renameLabel: string
  deleteLabel: string
}

export type PolicyStoreConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onClose: () => void
}
