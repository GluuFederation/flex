import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { useLocation } from 'react-router'
import { useAppNavigation } from '@/helpers/navigation'
import { useTheme } from '@/context/theme/themeContext'
import type { GluuTabsProps, NavigationTab, TabItem, TabPanelProps } from './types'
import { useStyles } from './styles/GluuTabs.style'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
const a11yProps = (index: number) => {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const TabPanel = React.memo((props: TabPanelProps) => {
  const { children, value, px, py, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box px={px} py={py}>
          {children}
        </Box>
      )}
    </div>
  )
})

TabPanel.displayName = 'TabPanel'

const isNavigationTab = (tab: TabItem | null): tab is NavigationTab => {
  return Boolean(
    tab &&
      typeof tab === 'object' &&
      'name' in tab &&
      'path' in tab &&
      typeof tab.path === 'string' &&
      tab.path.trim().length > 0,
  )
}

const initTabValue = (tabNames: TabItem[], pathname: string) => {
  const tabIndex = tabNames.findIndex((tab) => isNavigationTab(tab) && tab.path === pathname)
  return tabIndex >= 0 ? tabIndex : 0
}

const GluuTabs = ({
  tabNames,
  tabToShow,
  withNavigation = false,
  defaultTab = 0,
  rightAction,
  onTabChange,
}: GluuTabsProps) => {
  const path = useLocation()
  const { navigateToRoute } = useAppNavigation()
  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState?.theme || DEFAULT_THEME),
      isDark: themeState?.theme === THEME_DARK,
    }),
    [themeState?.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const [value, setValue] = useState(() => {
    if (withNavigation) {
      const pathIndex = initTabValue(tabNames, path.pathname)
      return pathIndex > 0 ? pathIndex : defaultTab
    }
    return defaultTab
  })

  const getTabLabel = useCallback((tab: TabItem) => {
    if (typeof tab === 'string') {
      return tab
    }

    return tab.name
  }, [])

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue)
      onTabChange?.(newValue)
      if (withNavigation) {
        const tab = tabNames[newValue] ?? null
        if (isNavigationTab(tab) && tab.path !== path.pathname) {
          navigateToRoute(tab.path, { replace: true })
        }
      }
    },
    [withNavigation, tabNames, navigateToRoute, path.pathname, onTabChange],
  )

  const tabLabels = useMemo(() => tabNames.map(getTabLabel), [tabNames, getTabLabel])

  useEffect(() => {
    if (!withNavigation) {
      return
    }

    const activeIndex = tabNames.findIndex(
      (tab) => isNavigationTab(tab) && tab.path === path.pathname,
    )

    if (activeIndex === -1) {
      const firstNavIndex = tabNames.findIndex(isNavigationTab)
      if (firstNavIndex !== -1) {
        const firstNavTab = tabNames[firstNavIndex] ?? null
        if (isNavigationTab(firstNavTab) && firstNavTab.path !== path.pathname) {
          navigateToRoute(firstNavTab.path, { replace: true })
        }
        setValue(firstNavIndex)
      } else {
        setValue(defaultTab)
      }
      return
    }

    const activeTab = tabNames[activeIndex] ?? null
    if (isNavigationTab(activeTab) && activeTab.path !== path.pathname) {
      navigateToRoute(activeTab.path, { replace: true })
    }
    setValue(activeIndex)
  }, [withNavigation, tabNames, path.pathname, navigateToRoute, defaultTab])

  const tabElements = useMemo(
    () =>
      tabLabels.map((label, index) => (
        <Tab data-testid={label} key={`tab-${index}`} label={label} {...a11yProps(index)} />
      )),
    [tabLabels],
  )

  const tabPanels = useMemo(
    () =>
      tabLabels.map((label, index) => (
        <TabPanel value={value} key={`tabpanel-${index}`} index={index} px={0} py={2}>
          {tabToShow(label)}
        </TabPanel>
      )),
    [tabLabels, value, tabToShow],
  )

  return (
    <Box className={classes.root}>
      <Box className={classes.tabsContainer}>
        <Box className={classes.tabsScrollable}>
          <Tabs value={value} variant="scrollable" onChange={handleChange} className={classes.tabs}>
            {tabElements}
          </Tabs>
        </Box>
        {rightAction && <Box className={classes.tabsRightAction}>{rightAction}</Box>}
      </Box>
      {tabPanels}
    </Box>
  )
}

export default GluuTabs
