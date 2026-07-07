import { useCallback, useMemo, useState, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import useMediaQuery from '@mui/material/useMediaQuery'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useAppNavigation } from '@/helpers/navigation'
import customColors from '@/customColors'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_LIGHT } from '@/context/theme/constants'
import { HomeIcon, OAuthIcon, UsersIcon } from '../SVG'
import { useStyles } from './MobileBottomNav.style'
import { MOBILE_MEDIA_QUERY, PRIMARY_TAB_DEFS, MORE_TAB_KEY } from './constants'
import MobileNavSheet from './MobileNavSheet'
import { isMoreMenuPath, type SheetItem, type SheetKey } from './sheetConstants'
import type { MobileNavTab, MobileBottomNavThemeColors } from './types'

const ICON_BY_KEY: Record<string, JSX.Element> = {
  home: <HomeIcon className="mobile-nav-icon" />,
  oauthserver: <OAuthIcon className="mobile-nav-icon" />,
  usersmanagement: <UsersIcon className="mobile-nav-icon" />,
}

const MobileBottomNav = (): JSX.Element | null => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)
  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()
  const location = useLocation()
  const { state } = useTheme()
  const [openSheet, setOpenSheet] = useState<SheetKey | null>(null)

  const themeColors = useMemo((): MobileBottomNavThemeColors => {
    const isLight = state.theme === THEME_LIGHT
    const theme = getThemeColor(state.theme)
    return {
      background: isLight ? customColors.white : theme.navbar.background,
      shadow: customColors.black,
      border: theme.navbar.border,
      active: customColors.mobileNavActive,
      inactive: isLight ? customColors.mobileNavInactiveLight : customColors.mobileNavInactiveDark,
    }
  }, [state.theme])

  const { classes, cx } = useStyles({ colors: themeColors })

  const tabs = useMemo((): MobileNavTab[] => {
    const primary: MobileNavTab[] = PRIMARY_TAB_DEFS.map((def) => ({
      key: def.key,
      titleKey: def.titleKey,
      path: def.path,
      basePath: def.basePath,
      directNav: 'directNav' in def ? def.directNav : undefined,
      icon: ICON_BY_KEY[def.iconKey],
    }))
    return [
      ...primary,
      {
        key: MORE_TAB_KEY,
        titleKey: 'menus.more',
        isMore: true,
        icon: <MoreVertIcon />,
      },
    ]
  }, [])

  const isTabActive = (tab: MobileNavTab): boolean => {
    if (openSheet) return openSheet === tab.key
    if (isMoreMenuPath(location.pathname)) return tab.isMore === true
    if (tab.isMore) return false
    const matchPath = tab.basePath ?? tab.path
    if (!matchPath) return false
    return location.pathname === matchPath || location.pathname.startsWith(`${matchPath}/`)
  }

  const handleTabClick = (tab: MobileNavTab): void => {
    if (tab.directNav && tab.path) {
      setOpenSheet(null)
      navigateToRoute(tab.path)
      return
    }
    setOpenSheet((current) => (current === tab.key ? null : (tab.key as SheetKey)))
  }

  const handleSheetClose = useCallback((): void => {
    setOpenSheet(null)
  }, [])

  const handleSheetSelect = useCallback(
    (item: SheetItem): void => {
      if (!item.path) return
      setOpenSheet(null)
      navigateToRoute(item.path)
    },
    [navigateToRoute],
  )

  if (!isMobile) return null

  return (
    <>
      <nav
        className={cx(classes.root, openSheet && classes.rootElevated)}
        aria-label={t('menus.home')}
        data-testid="mobile-bottom-nav"
      >
        {tabs.map((tab) => {
          const active = isTabActive(tab)
          return (
            <button
              key={tab.key}
              type="button"
              className={cx(classes.tab, active && classes.tabActive)}
              aria-current={active ? 'page' : undefined}
              aria-label={t(tab.titleKey)}
              onClick={() => handleTabClick(tab)}
            >
              <span className={classes.iconWrap}>{tab.icon}</span>
              <span className={classes.label}>{t(tab.titleKey)}</span>
              {active ? <span className={classes.activeIndicator} /> : null}
            </button>
          )
        })}
      </nav>
      <MobileNavSheet openKey={openSheet} onClose={handleSheetClose} onSelect={handleSheetSelect} />
    </>
  )
}

export default MobileBottomNav
