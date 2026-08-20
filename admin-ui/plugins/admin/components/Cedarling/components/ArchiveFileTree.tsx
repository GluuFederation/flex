import React, { useCallback, useState } from 'react'
import { Box } from '@mui/material'
import { ExpandMore } from '@/components/icons'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import type { ArchiveTreeNode } from '@/utils/cjarArchive'

type ArchiveFileTreeProps = {
  nodes: readonly ArchiveTreeNode[]
  selectedPath: string | null
  dirtyPaths: ReadonlySet<string>
  onSelect: (path: string) => void
  classes: {
    treeRow: string
    treeRowSelected: string
    treeRowName: string
    dirtyDot: string
    treeIcon: string
  }
  depth?: number
}

const INDENT_PER_LEVEL = 12

/**
 * Directory tree for the archive. Directories are collapsible and start expanded so the whole
 * archive is visible on open — a policy store holds a handful of files, not a deep source tree.
 */
const ArchiveFileTree: React.FC<ArchiveFileTreeProps> = ({
  nodes,
  selectedPath,
  dirtyPaths,
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
          dirtyPaths={dirtyPaths}
          onSelect={onSelect}
          classes={classes}
          depth={depth}
        />
      ) : (
        <ArchiveFile
          key={node.path}
          node={node}
          isSelected={selectedPath === node.path}
          isDirty={dirtyPaths.has(node.path)}
          onSelect={onSelect}
          classes={classes}
          depth={depth}
        />
      ),
    )}
  </Box>
)

const ArchiveDirectory: React.FC<{
  node: ArchiveTreeNode
  selectedPath: string | null
  dirtyPaths: ReadonlySet<string>
  onSelect: (path: string) => void
  classes: ArchiveFileTreeProps['classes']
  depth: number
}> = ({ node, selectedPath, dirtyPaths, onSelect, classes, depth }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const toggle = useCallback(() => setIsExpanded((prev) => !prev), [])

  return (
    <Box>
      <Box
        className={classes.treeRow}
        style={{ paddingLeft: depth * INDENT_PER_LEVEL + 6 }}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            toggle()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={node.name}
      >
        <ExpandMore
          className={classes.treeIcon}
          style={{ transform: isExpanded ? 'none' : 'rotate(-90deg)' }}
          aria-hidden
        />
        <GluuText variant="span" disableThemeColor className={classes.treeRowName}>
          {node.name}
        </GluuText>
      </Box>
      {isExpanded && (
        <ArchiveFileTree
          nodes={node.children}
          selectedPath={selectedPath}
          dirtyPaths={dirtyPaths}
          onSelect={onSelect}
          classes={classes}
          depth={depth + 1}
        />
      )}
    </Box>
  )
}

const ArchiveFile: React.FC<{
  node: ArchiveTreeNode
  isSelected: boolean
  isDirty: boolean
  onSelect: (path: string) => void
  classes: ArchiveFileTreeProps['classes']
  depth: number
}> = ({ node, isSelected, isDirty, onSelect, classes, depth }) => {
  const handleSelect = useCallback(() => onSelect(node.path), [onSelect, node.path])

  return (
    <Box
      className={`${classes.treeRow} ${isSelected ? classes.treeRowSelected : ''}`}
      style={{ paddingLeft: depth * INDENT_PER_LEVEL + 24 }}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleSelect()
        }
      }}
      role="button"
      tabIndex={0}
      aria-current={isSelected}
      aria-label={node.name}
    >
      <GluuText variant="span" disableThemeColor className={classes.treeRowName}>
        {node.name}
      </GluuText>
      {isDirty && <Box className={classes.dirtyDot} aria-label="unsaved changes" />}
    </Box>
  )
}

export default React.memo(ArchiveFileTree)
