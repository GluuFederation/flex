import React, { useState, useMemo, useCallback } from 'react'
import { Box, Collapse } from '@mui/material'
import { Check, ExpandMore } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import { themeConfig } from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import {
  REGEX_ID_SANITIZE_CHARS,
  REGEX_ID_COLLAPSE_HYPHENS,
  REGEX_ID_TRIM_HYPHENS,
} from '@/utils/regex'
import type { RolePermissionCardProps } from './types'
import { useStyles } from './styles/MappingPage.style'

const CONTENT_ID_PREFIX = 'mapping-content-'
const CONTENT_ID_ROLE_FALLBACK = 'role'
const TOGGLE_KEYS = new Set(['Enter', ' '])
const ARIA_ASSIGNED = 'assigned'
const ARIA_UNASSIGNED = 'unassigned'

interface ExtendedRolePermissionCardProps extends RolePermissionCardProps {
  allPermissions: string[]
  itemIndex?: number
}

const PermissionCheckbox: React.FC<{
  permission: string
  isChecked: boolean
  classes: ReturnType<typeof useStyles>['classes']
}> = React.memo(({ permission, isChecked, classes }) => (
  <Box
    className={classes.permissionItem}
    role="checkbox"
    aria-checked={isChecked}
    aria-label={`${permission}, ${isChecked ? ARIA_ASSIGNED : ARIA_UNASSIGNED}`}
    tabIndex={0}
  >
    <Box
      className={`${classes.checkbox} ${isChecked ? classes.checkboxChecked : classes.checkboxUnchecked}`}
    >
      {isChecked && <Check className={classes.checkIcon} aria-hidden={true} />}
    </Box>
    <GluuText variant="span" className={classes.permissionLabel} disableThemeColor>
      {permission}
    </GluuText>
  </Box>
))

PermissionCheckbox.displayName = 'PermissionCheckbox'

const RolePermissionCard: React.FC<ExtendedRolePermissionCardProps> = React.memo(
  function RolePermissionCard({ candidate, allPermissions, itemIndex = 0 }) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const { state } = useTheme()
  const isDark = state.theme === THEME_DARK
  const currentTheme = themeConfig[state.theme]
  const { classes } = useStyles({ isDark, theme: currentTheme })

  const rolePermissions = useMemo(
    () => new Set(candidate?.permissions || []),
    [candidate?.permissions],
  )

  const sortedPermissions = useMemo(() => {
    const checked: string[] = []
    const unchecked: string[] = []
    for (const p of allPermissions) {
      if (rolePermissions.has(p)) checked.push(p)
      else unchecked.push(p)
    }
    return [...checked, ...unchecked]
  }, [allPermissions, rolePermissions])

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  const contentId = useMemo(() => {
    const rolePart =
      (candidate?.role ?? '')
        .replace(REGEX_ID_SANITIZE_CHARS, '-')
        .replace(REGEX_ID_COLLAPSE_HYPHENS, '-')
        .replace(REGEX_ID_TRIM_HYPHENS, '') || CONTENT_ID_ROLE_FALLBACK
    return `${CONTENT_ID_PREFIX}${itemIndex}-${rolePart}`
  }, [candidate?.role, itemIndex])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (TOGGLE_KEYS.has(e.key)) {
        e.preventDefault()
        handleToggle()
      }
    },
    [handleToggle],
  )

  const permissionCheckboxes = useMemo(() => {
    if (!isExpanded) return null
    return sortedPermissions.map((permission) => (
      <PermissionCheckbox
        key={permission}
        permission={permission}
        isChecked={rolePermissions.has(permission)}
        classes={classes}
      />
    ))
  }, [isExpanded, sortedPermissions, rolePermissions, classes])

  return (
    <Box className={classes.roleCard}>
      <Box
        className={classes.roleCardHeader}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <GluuText variant="h3" className={classes.roleTitle} disableThemeColor>
          {candidate?.role}
        </GluuText>
        <Box className={classes.roleHeaderRight}>
          <GluuText variant="span" className={classes.permissionCount} disableThemeColor>
            <GluuText variant="span" className={classes.permissionCountHighlight} disableThemeColor>
              {rolePermissions.size}
            </GluuText>
            {` ${t('messages.out_of')} ${allPermissions.length} ${t('messages.permission_label')}`}
          </GluuText>
          <ExpandMore
            className={`${classes.chevronIcon} ${isExpanded ? classes.chevronIconOpen : ''}`}
          />
        </Box>
      </Box>
      <Collapse in={isExpanded}>
        <Box id={contentId} className={classes.roleCardContent}>
          {allPermissions.length === 0 ? (
            <GluuText variant="p" className={classes.noPermissions} disableThemeColor>
              {t('messages.no_permissions_assigned')}
            </GluuText>
          ) : (
            <Box className={classes.permissionsGrid}>{permissionCheckboxes}</Box>
          )}
        </Box>
      </Collapse>
    </Box>
  )
  }
)

export default RolePermissionCard
