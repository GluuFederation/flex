import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { useLocation, useNavigate } from 'react-router'
import customColors from '@/customColors'

interface TabPanelProps {
  children?: React.ReactNode
  value: number
  px?: number
  py?: number
  index: number
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

const a11yProps = (index: number) => {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

interface NavigationTab {
  name: string
  path: string
}

type TabItem = string | NavigationTab

const isNavigationTab = (tab: TabItem | undefined): tab is NavigationTab => {
  return Boolean(tab && typeof tab === 'object' && 'name' in tab && 'path' in tab)
}

const initTabValue = (tabNames: NavigationTab[], pathname: string) => {
  const tabIndex = tabNames.findIndex((tab) => tab.path === pathname)
  return tabIndex >= 0 ? tabIndex : 0
}

interface GluuTabsProps {
  tabNames: TabItem[]
  tabToShow: (tabName: string) => React.ReactNode
  withNavigation?: boolean
}

export default function GluuTabs({ tabNames, tabToShow, withNavigation = false }: GluuTabsProps) {
  const path = useLocation()
  const navigate = useNavigate()

  // Memoize navigation tabs extraction
  const navigationTabs = useMemo(() => tabNames.filter(isNavigationTab), [tabNames])

  // Calculate initial value (only used on mount by useState)
  const [value, setValue] = useState(() =>
    withNavigation ? initTabValue(navigationTabs, path.pathname) : 0,
  )

  // Memoize tab label getter
  const getTabLabel = useCallback((tab: TabItem) => (isNavigationTab(tab) ? tab.name : tab), [])

  // Memoize tab change handler
  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue)
      if (withNavigation) {
        const tab = navigationTabs[newValue]
        if (tab) {
          navigate(tab.path, { replace: true })
        }
      }
    },
    [withNavigation, navigationTabs, navigate],
  )

  // Memoize tabs styling
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

  // Memoize tab labels array
  const tabLabels = useMemo(() => tabNames.map(getTabLabel), [tabNames, getTabLabel])

  // Sync tab value with URL pathname
  useEffect(() => {
    if (!withNavigation) {
      return
    }

    const activeIndex = navigationTabs.findIndex((tab) => tab.path === path.pathname)
    if (activeIndex === -1) {
      if (navigationTabs[0]) {
        navigate(navigationTabs[0].path, { replace: true })
      }
      setValue(0)
      return
    }

    navigate(navigationTabs[activeIndex].path, { replace: true })
    setValue(activeIndex)
  }, [withNavigation, navigationTabs, path.pathname, navigate])

  // Memoize tab elements
  const tabElements = useMemo(
    () =>
      tabLabels.map((label, index) => (
        <Tab data-testid={label} key={`${label}-${index}`} label={label} {...a11yProps(index)} />
      )),
    [tabLabels],
  )

  // Memoize tab panel elements
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
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} variant="scrollable" onChange={handleChange} sx={tabsSx}>
          {tabElements}
        </Tabs>
      </Box>
      {tabPanels}
    </Box>
  )
}
