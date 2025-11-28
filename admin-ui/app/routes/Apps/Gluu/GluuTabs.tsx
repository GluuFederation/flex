import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { useLocation } from 'react-router'
import customColors from '@/customColors'
import { useAppNavigation } from '@/helpers/navigation'

interface NamedTab {
  name: string
  path?: string | null
}

interface NavigationTab extends NamedTab {
  path: string
}

type TabItem = string | NamedTab

interface TabPanelProps {
  children?: React.ReactNode
  value: number
  px?: number
  py?: number
  index: number
}

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

interface GluuTabsProps {
  tabNames: TabItem[]
  tabToShow: (tabName: string) => React.ReactNode
  withNavigation?: boolean
}

export default function GluuTabs({ tabNames, tabToShow, withNavigation = false }: GluuTabsProps) {
  const path = useLocation()
  const { navigateToRoute } = useAppNavigation()

  const [value, setValue] = useState(() =>
    withNavigation ? initTabValue(tabNames, path.pathname) : 0,
  )

  const getTabLabel = useCallback((tab: TabItem) => {
    if (typeof tab === 'string') {
      return tab
    }

    return tab.name
  }, [])

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue)
      if (withNavigation) {
        const tab = tabNames[newValue] ?? null
        if (isNavigationTab(tab) && tab.path !== path.pathname) {
          navigateToRoute(tab.path, { replace: true })
        }
      }
    },
    [withNavigation, tabNames, navigateToRoute, path.pathname],
  )

  const tabsSx = useMemo(
    () => ({
      '& .MuiTab-root.Mui-selected': {
        color: customColors.lightBlue,
        fontWeight: 600,
        background: customColors.lightBlue,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        position: 'relative',
      },
      '& .MuiTabs-indicator': {
        background: customColors.lightBlue,
        height: 3,
        borderRadius: '2px',
        boxShadow: `0 2px 4px ${customColors.logo}`,
      },
    }),
    [],
  )

  const tabsContainerSx = useMemo(
    () => ({
      borderBottom: 1,
      borderColor: 'divider',
    }),
    [],
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
        setValue(0)
      }
      return
    }

    const activeTab = tabNames[activeIndex] ?? null
    if (isNavigationTab(activeTab)) {
      navigateToRoute(activeTab.path, { replace: true })
    }
    setValue(activeIndex)
  }, [withNavigation, tabNames, path.pathname, navigateToRoute])

  const tabElements = useMemo(
    () =>
      tabLabels.map((label, index) => (
        <Tab data-testid={label} key={`${label}-${index}`} label={label} {...a11yProps(index)} />
      )),
    [tabLabels],
  )

  const tabPanels = useMemo(
    () =>
      tabLabels.map((label, index) => (
        <TabPanel value={value} key={`${label}-${index}-panel`} index={index} px={0} py={2}>
          {tabToShow(label)}
        </TabPanel>
      )),
    [tabLabels, value, tabToShow],
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={tabsContainerSx}>
        <Tabs value={value} variant="scrollable" onChange={handleChange} sx={tabsSx}>
          {tabElements}
        </Tabs>
      </Box>
      {tabPanels}
    </Box>
  )
}
