import { useCallback, useEffect, useMemo, useState, type JSX } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Close } from '@/components/icons'
import customColors from '@/customColors'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_LIGHT } from '@/context/theme/constants'
import { ChevronIcon } from '../SVG'
import { useStyles } from './MobileNavSheet.style'
import { SHEET_ICON_BY_KEY } from './sheetIcons'
import {
  MORE_TILE_DEFS,
  SECTION_MENUS,
  SHEET_KEYS,
  type SheetItem,
  type SheetKey,
} from './sheetConstants'
import type { MobileNavSheetThemeColors } from './types'

type MobileNavSheetProps = {
  openKey: SheetKey | null
  onClose: () => void
  onSelect: (item: SheetItem) => void
}

const MobileNavSheet = ({
  openKey,
  onClose,
  onSelect,
}: MobileNavSheetProps): JSX.Element | null => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const location = useLocation()
  const isLight = state.theme === THEME_LIGHT
  const [expandedKeys, setExpandedKeys] = useState<readonly string[]>([])
  const [drillTile, setDrillTile] = useState<SheetItem | null>(null)

  const toggleExpanded = useCallback((key: string): void => {
    setExpandedKeys((keys) => (keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]))
  }, [])

  const themeColors = useMemo((): MobileNavSheetThemeColors => {
    const theme = getThemeColor(state.theme)
    return {
      background: isLight ? customColors.white : theme.navbar.background,
      border: theme.navbar.border,
      text: theme.fontColor,
      listText: isLight ? customColors.textSecondary : customColors.white,
      title: isLight ? theme.fontColor : customColors.mobileSheetTitleDark,
      chip: isLight ? customColors.mobileSheetTileChipLight : customColors.mobileSheetTileChipDark,
      active: customColors.mobileNavActive,
      white: customColors.white,
    }
  }, [state.theme, isLight])

  const { classes, cx } = useStyles({ colors: themeColors })

  useEffect(() => {
    if (!openKey) return undefined
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openKey, onClose])

  const isItemActive = useCallback(
    (item: SheetItem): boolean =>
      !!item.path &&
      (location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)),
    [location.pathname],
  )

  useEffect(() => {
    if (!openKey) {
      setExpandedKeys([])
      setDrillTile(null)
      return
    }
    if (openKey === SHEET_KEYS.MORE) {
      setExpandedKeys([])
      const activeTile = MORE_TILE_DEFS.find((tile) =>
        tile.children?.some((child) => isItemActive(child)),
      )
      setDrillTile(activeTile ?? null)
      return
    }
    setDrillTile(null)
    const menu = SECTION_MENUS[openKey as 'home' | 'auth-server' | 'users']
    const activeGroups = (menu?.items ?? [])
      .filter((item) => item.children?.some((child) => isItemActive(child)))
      .map((item) => item.key)
    setExpandedKeys(activeGroups)
  }, [openKey, isItemActive])

  if (!openKey || typeof document === 'undefined') return null

  const isMore = openKey === SHEET_KEYS.MORE
  const section = isMore ? null : SECTION_MENUS[openKey as 'home' | 'auth-server' | 'users']
  const isDrilled = isMore && drillTile !== null

  const headerTitleKey = isDrilled
    ? (drillTile?.titleKey ?? '')
    : isMore
      ? 'menus.allCategory'
      : (section?.titleKey ?? '')
  const headerIcon = isDrilled
    ? SHEET_ICON_BY_KEY[drillTile?.iconKey ?? '']
    : isMore
      ? null
      : SHEET_ICON_BY_KEY[section?.iconKey ?? '']

  const handleTileClick = (tile: SheetItem): void => {
    if (tile.children?.length) {
      setDrillTile(tile)
      return
    }
    if (!tile.path) return
    onSelect(tile)
  }

  return createPortal(
    <>
      <button
        type="button"
        className={classes.scrim}
        onClick={onClose}
        aria-label={t('actions.close')}
      />
      <div
        className={classes.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={t(headerTitleKey)}
        data-testid="mobile-nav-sheet"
      >
        <div className={classes.header}>
          {isDrilled ? (
            <button
              type="button"
              className={classes.back}
              onClick={() => setDrillTile(null)}
              aria-label={t('actions.back')}
            >
              <ArrowBackIcon />
            </button>
          ) : null}
          {headerIcon ? <span className={classes.headerIcon}>{headerIcon}</span> : null}
          <span
            className={cx(classes.headerTitle, isMore && !isDrilled && classes.headerTitleMuted)}
            data-testid="mobile-nav-sheet-title"
          >
            {t(headerTitleKey)}
          </span>
          <button
            type="button"
            className={classes.close}
            onClick={onClose}
            aria-label={t('actions.close')}
          >
            <Close />
          </button>
        </div>

        <div className={classes.body}>
          {isDrilled ? (
            <div className={classes.list}>
              {drillTile?.children?.map((child) => {
                const childActive = isItemActive(child)
                return (
                  <button
                    key={child.key}
                    type="button"
                    className={cx(classes.listItem, childActive && classes.listItemActive)}
                    aria-current={childActive ? 'page' : undefined}
                    onClick={() => onSelect(child)}
                  >
                    {t(child.titleKey)}
                  </button>
                )
              })}
            </div>
          ) : isMore ? (
            <div className={classes.grid}>
              {MORE_TILE_DEFS.map((tile) => {
                const active =
                  isItemActive(tile) || !!tile.children?.some((child) => isItemActive(child))
                return (
                  <button
                    key={tile.key}
                    type="button"
                    className={classes.tile}
                    aria-current={active ? 'page' : undefined}
                    aria-label={t(tile.titleKey)}
                    onClick={() => handleTileClick(tile)}
                  >
                    <span className={cx(classes.tileChip, active && classes.tileChipActive)}>
                      {SHEET_ICON_BY_KEY[tile.iconKey ?? '']}
                    </span>
                    <span className={cx(classes.tileLabel, active && classes.tileLabelActive)}>
                      {t(tile.titleKey)}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className={classes.list}>
              {section?.items.map((item) => {
                if (item.children?.length) {
                  const expanded = expandedKeys.includes(item.key)
                  return (
                    <div key={item.key} className={classes.listGroup}>
                      <button
                        type="button"
                        className={classes.listItem}
                        aria-expanded={expanded}
                        onClick={() => toggleExpanded(item.key)}
                      >
                        {t(item.titleKey)}
                        <ChevronIcon
                          className={classes.chevron}
                          direction={expanded ? 'up' : 'down'}
                        />
                      </button>
                      {expanded ? (
                        <div className={classes.subList}>
                          {item.children.map((child) => {
                            const childActive = isItemActive(child)
                            return (
                              <button
                                key={child.key}
                                type="button"
                                className={cx(
                                  classes.subListItem,
                                  childActive && classes.listItemActive,
                                )}
                                aria-current={childActive ? 'page' : undefined}
                                onClick={() => onSelect(child)}
                              >
                                {t(child.titleKey)}
                              </button>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                  )
                }

                const active = isItemActive(item)
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={cx(classes.listItem, active && classes.listItemActive)}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onSelect(item)}
                  >
                    {t(item.titleKey)}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body,
  )
}

export default MobileNavSheet
