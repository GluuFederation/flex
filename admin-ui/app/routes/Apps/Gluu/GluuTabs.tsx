import { useEffect, useState } from 'react'
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

const TabPanel = (props: TabPanelProps) => {
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
}

const a11yProps = (index: number) => {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const initTabValue = (tabNames: any[], path: any) => {
  const tab = tabNames
    .map((tab: any, index: number) => {
      if (tab.path === path.pathname) {
        return { ...tab, index: index }
      }
    })
    ?.filter((tab: any) => tab)?.[0]

  return tab?.index || 0
}

interface GluuTabsProps {
  tabNames: any[]
  tabToShow: (tabName: any) => React.ReactNode
  withNavigation?: boolean
}

export default function GluuTabs({ tabNames, tabToShow, withNavigation = false }: GluuTabsProps) {
  const path = useLocation()
  const [value, setValue] = useState(withNavigation ? initTabValue(tabNames, path) : 0)
  const navigate = useNavigate()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    if (withNavigation) {
      const tab = tabNames.find((tab: any, index: number) => index === newValue)
      navigate(tab.path, { replace: true })
    }
  }

  useEffect(() => {
    if (withNavigation) {
      const tab = tabNames
        .map((tab: any, index: number) => {
          if (tab.path === path.pathname) {
            return { ...tab, index: index }
          }
        })
        ?.filter((tab: any) => tab)?.[0]

      if (!tab) {
        navigate(tabNames[0].path, { replace: true })
        setValue(0)
        return
      }

      navigate(tab.path, { replace: true })
      setValue(tab.index)
    }
  }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          variant="scrollable"
          onChange={handleChange}
          sx={{
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
          }}
        >
          {tabNames?.map((tab: any, index: number) => (
            <Tab
              data-testid={withNavigation ? tab.name : tab}
              key={(withNavigation ? tab.name : tab) + index.toString()}
              label={withNavigation ? tab.name : tab}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
      {tabNames?.map((tab: any, index: number) => (
        <TabPanel
          value={value}
          key={(withNavigation ? tab.name : tab) + index.toString()}
          index={index}
          px={0}
          py={2}
        >
          {tabToShow(withNavigation ? tab.name : tab)}
        </TabPanel>
      ))}
    </Box>
  )
}
