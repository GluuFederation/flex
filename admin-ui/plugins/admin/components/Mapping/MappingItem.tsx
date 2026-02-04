import React, { useState, useMemo, useCallback } from 'react'
import { Box, Collapse } from '@mui/material'
import { Check, ExpandMore } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import { themeConfig } from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import type { MappingItemProps } from './types'
import { useStyles } from './styles/MappingPage.style'

interface ExtendedMappingItemProps extends MappingItemProps {
  allPermissions: string[]
}

const PermissionCheckbox: React.FC<{
  permission: string
  isChecked: boolean
  classes: ReturnType<typeof useStyles>['classes']
}> = React.memo(({ permission, isChecked, classes }) => (
  <Box className={classes.permissionItem}>
    <Box
      className={`${classes.checkbox} ${isChecked ? classes.checkboxChecked : classes.checkboxUnchecked}`}
    >
      {isChecked && <Check className={classes.checkIcon} />}
    </Box>
    <GluuText variant="span" className={classes.permissionLabel} disableThemeColor>
      {permission}
    </GluuText>
  </Box>
))

PermissionCheckbox.displayName = 'PermissionCheckbox'

const MappingItem: React.FC<ExtendedMappingItemProps> = React.memo(function MappingItem({
  candidate,
  allPermissions,
}) {
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

  const contentId = useMemo(
    () => `mapping-content-${(candidate?.role ?? '').replace(/\s+/g, '-') || 'role'}`,
    [candidate?.role],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
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
})

export default MappingItem
