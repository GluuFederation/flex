import React, { useCallback, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import {
  DeleteOutlined,
  DescriptionOutlined,
  EditOutlined,
  ExpandMore,
  FolderOpenOutlined,
  FolderOutlined,
} from '@/components/icons'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { countTreeFiles, type ArchiveTreeNode } from '@/utils/cjarArchive'
import { TREE_ROW_ACTIONS_CLASS } from '../styles/ArchiveExplorerPage.style'
import type {
  ArchiveDirectoryProps,
  ArchiveFileProps,
  ArchiveFileTreeProps,
  ArchiveRowActionsProps,
} from '../types/CedarlingTypes'

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

const ArchiveRowActions = ({
  path,
  name,
  classes,
  onRename,
  onDelete,
  renameLabel,
  deleteLabel,
}: ArchiveRowActionsProps) => {
  const stop = useCallback((event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation()
  }, [])

  const handleRename = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      onRename?.(path)
    },
    [onRename, path],
  )

  const handleDelete = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      onDelete?.(path)
    },
    [onDelete, path],
  )

  if (!onRename && !onDelete) return null

  return (
    <span className={`${classes.treeRowActions} ${TREE_ROW_ACTIONS_CLASS}`}>
      {onRename && (
        <button
          type="button"
          className={classes.treeRowAction}
          onClick={handleRename}
          onKeyDown={stop}
          title={`${renameLabel}: ${name}`}
          aria-label={`${renameLabel}: ${name}`}
        >
          <EditOutlined className={classes.paneActionIcon} aria-hidden />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          className={classes.treeRowAction}
          onClick={handleDelete}
          onKeyDown={stop}
          title={`${deleteLabel}: ${name}`}
          aria-label={`${deleteLabel}: ${name}`}
        >
          <DeleteOutlined className={classes.paneActionIcon} aria-hidden />
        </button>
      )}
    </span>
  )
}

const ArchiveDirectory = React.memo(function ArchiveDirectory({
  node,
  selectedPath,
  onSelect,
  classes,
  canEdit,
  onRename,
  onDelete,
  renameLabel,
  deleteLabel,
  depth,
}: ArchiveDirectoryProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const toggle = useCallback(() => setIsExpanded((prev) => !prev), [])
  const handleKeyDown = useMemo(() => activateOnKey(toggle), [toggle])
  const rowStyle = useMemo(
    () => ({ paddingLeft: depth * INDENT_PER_LEVEL + DIRECTORY_INDENT }),
    [depth],
  )
  const fileCount = useMemo(() => countTreeFiles(node.children), [node.children])

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
        <GluuText variant="span" disableThemeColor className={classes.treeRowCount}>
          {fileCount}
        </GluuText>
        {canEdit && (
          <ArchiveRowActions
            path={node.path}
            name={node.name}
            classes={classes}
            onRename={onRename}
            onDelete={onDelete}
            renameLabel={renameLabel}
            deleteLabel={deleteLabel}
          />
        )}
      </Box>
      {isExpanded && (
        <ArchiveFileTree
          nodes={node.children}
          selectedPath={selectedPath}
          onSelect={onSelect}
          classes={classes}
          canEdit={canEdit}
          onRename={onRename}
          onDelete={onDelete}
          renameLabel={renameLabel}
          deleteLabel={deleteLabel}
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
  canEdit,
  onRename,
  onDelete,
  renameLabel,
  deleteLabel,
  depth,
}: ArchiveFileProps) {
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
      {canEdit && (
        <ArchiveRowActions
          path={node.path}
          name={node.name}
          classes={classes}
          onRename={onRename}
          onDelete={onDelete}
          renameLabel={renameLabel}
          deleteLabel={deleteLabel}
        />
      )}
    </Box>
  )
})

const ArchiveFileTree: React.FC<ArchiveFileTreeProps> = ({
  nodes,
  selectedPath,
  onSelect,
  classes,
  canEdit = false,
  onRename,
  onDelete,
  renameLabel,
  deleteLabel,
  rootLabel,
  depth = 0,
}) => {
  const directories = nodes.filter((node) => node.isDirectory)
  const files = nodes.filter((node) => !node.isDirectory)
  const showRootLabel = Boolean(rootLabel) && directories.length > 0 && files.length > 0

  const renderFile = (node: ArchiveTreeNode) => (
    <ArchiveFile
      key={node.path}
      node={node}
      isSelected={selectedPath === node.path}
      onSelect={onSelect}
      classes={classes}
      canEdit={canEdit}
      onRename={onRename}
      onDelete={onDelete}
      renameLabel={renameLabel}
      deleteLabel={deleteLabel}
      depth={depth}
    />
  )

  return (
    <Box>
      {directories.map((node) => (
        <ArchiveDirectory
          key={node.path}
          node={node}
          selectedPath={selectedPath}
          onSelect={onSelect}
          classes={classes}
          canEdit={canEdit}
          onRename={onRename}
          onDelete={onDelete}
          renameLabel={renameLabel}
          deleteLabel={deleteLabel}
          depth={depth}
        />
      ))}
      {showRootLabel && (
        <GluuText variant="span" disableThemeColor className={classes.treeSectionLabel}>
          {rootLabel}
        </GluuText>
      )}
      {files.map(renderFile)}
    </Box>
  )
}

export default React.memo(ArchiveFileTree)
