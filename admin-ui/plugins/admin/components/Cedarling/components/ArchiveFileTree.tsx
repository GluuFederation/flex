import React, { useCallback, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import {
  DescriptionOutlined,
  ExpandMore,
  FolderOpenOutlined,
  FolderOutlined,
} from '@/components/icons'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import type { ArchiveTreeNode } from '@/utils/cjarArchive'

type ArchiveFileTreeProps = {
  nodes: readonly ArchiveTreeNode[]
  selectedPath: string | null
  onSelect: (path: string) => void
  classes: {
    treeRow: string
    treeRowSelected: string
    treeRowName: string
    treeIcon: string
    treeFileIcon: string
  }
  depth?: number
}

const INDENT_PER_LEVEL = 12
const DIRECTORY_INDENT = 6
const CHEVRON_COLUMN_WIDTH = 26
const FILE_INDENT = DIRECTORY_INDENT + CHEVRON_COLUMN_WIDTH

const CHEVRON_EXPANDED = { transform: 'none' } as const
const CHEVRON_COLLAPSED = { transform: 'rotate(-90deg)' } as const

const activateOnKey = (action: () => void) => (event: React.KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    action()
  }
}

/**
 * Directory tree for the archive. Directories are collapsible and start expanded so the whole
 * archive is visible on open — a policy store holds a handful of files, not a deep source tree.
 */
const ArchiveFileTree: React.FC<ArchiveFileTreeProps> = ({
  nodes,
  selectedPath,
  onSelect,
  classes,
  depth = 0,
}) => (
  <Box>
    {nodes.map((node) =>
      node.isDirectory ? (
        <ArchiveDirectory
          key={node.path}
          node={node}
          selectedPath={selectedPath}
          onSelect={onSelect}
          classes={classes}
          depth={depth}
        />
      ) : (
        <ArchiveFile
          key={node.path}
          node={node}
          isSelected={selectedPath === node.path}
          onSelect={onSelect}
          classes={classes}
          depth={depth}
        />
      ),
    )}
  </Box>
)

const ArchiveDirectory = React.memo(function ArchiveDirectory({
  node,
  selectedPath,
  onSelect,
  classes,
  depth,
}: {
  node: ArchiveTreeNode
  selectedPath: string | null
  onSelect: (path: string) => void
  classes: ArchiveFileTreeProps['classes']
  depth: number
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const toggle = useCallback(() => setIsExpanded((prev) => !prev), [])
  const handleKeyDown = useMemo(() => activateOnKey(toggle), [toggle])
  const rowStyle = useMemo(
    () => ({ paddingLeft: depth * INDENT_PER_LEVEL + DIRECTORY_INDENT }),
    [depth],
  )

  return (
    <Box>
      <Box
        className={classes.treeRow}
        style={rowStyle}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={node.name}
        title={node.name}
      >
        <ExpandMore
          className={classes.treeIcon}
          style={isExpanded ? CHEVRON_EXPANDED : CHEVRON_COLLAPSED}
          aria-hidden
        />
        {isExpanded ? (
          <FolderOpenOutlined className={classes.treeFileIcon} aria-hidden />
        ) : (
          <FolderOutlined className={classes.treeFileIcon} aria-hidden />
        )}
        <GluuText variant="span" disableThemeColor className={classes.treeRowName}>
          {node.name}
        </GluuText>
      </Box>
      {isExpanded && (
        <ArchiveFileTree
          nodes={node.children}
          selectedPath={selectedPath}
          onSelect={onSelect}
          classes={classes}
          depth={depth + 1}
        />
      )}
    </Box>
  )
})

const ArchiveFile = React.memo(function ArchiveFile({
  node,
  isSelected,
  onSelect,
  classes,
  depth,
}: {
  node: ArchiveTreeNode
  isSelected: boolean
  onSelect: (path: string) => void
  classes: ArchiveFileTreeProps['classes']
  depth: number
}) {
  const handleSelect = useCallback(() => onSelect(node.path), [onSelect, node.path])
  const handleKeyDown = useMemo(() => activateOnKey(handleSelect), [handleSelect])
  const rowStyle = useMemo(() => ({ paddingLeft: depth * INDENT_PER_LEVEL + FILE_INDENT }), [depth])
  const rowClass = isSelected ? `${classes.treeRow} ${classes.treeRowSelected}` : classes.treeRow

  return (
    <Box
      className={rowClass}
      style={rowStyle}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-current={isSelected}
      aria-label={node.name}
      title={node.name}
    >
      <DescriptionOutlined className={classes.treeFileIcon} aria-hidden />
      <GluuText variant="span" disableThemeColor className={classes.treeRowName}>
        {node.name}
      </GluuText>
    </Box>
  )
})

export default React.memo(ArchiveFileTree)
