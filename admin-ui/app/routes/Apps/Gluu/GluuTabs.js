import React, { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { useLocation, useNavigate } from 'react-router'

const TabPanel = (props) => {
  const { children, value, px, py, index, ...other } = props
  return (
    <div
      role='tabpanel'
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

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const initTabValue = (tabNames, path) => {
  const tab = tabNames
    .map((tab, index) => {
      if (tab.path === path.pathname) {
        return { ...tab, index: index }
      }
    })
    ?.filter((tab) => tab)?.[0]

  return tab?.index || 0
}

export default function GluuTabs({
  tabNames,
  tabToShow,
  withNavigation = false,
}) {
  const path = useLocation()
  const [value, setValue] = useState(
    withNavigation ? initTabValue(tabNames, path) : 0,
  )
  const navigate = useNavigate()

  const handleChange = (event, newValue) => {
    setValue(newValue)
    if (withNavigation) {
      const tab = tabNames.find((tab, index) => index === newValue)
      navigate(tab.path, { replace: true })
    }
  }

  useEffect(() => {
    if (withNavigation) {
      const tab = tabNames
        .map((tab, index) => {
          if (tab.path === path.pathname) {
            return { ...tab, index: index }
          }
        })
        ?.filter((tab) => tab)?.[0]

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
        <Tabs value={value} variant='scrollable' onChange={handleChange}>
          {tabNames?.map((tab, index) => (
            <Tab
              data-testid={withNavigation ? tab.name : tab}
              key={(withNavigation ? tab.name : tab) + index.toString()}
              label={withNavigation ? tab.name : tab}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
      {tabNames?.map((tab, index) => (
        <TabPanel
          value={value}
          key={(withNavigation ? tab.name : tab) + index.toString()}
          index={index}
        >
          {tabToShow(withNavigation ? tab.name : tab)}
        </TabPanel>
      ))}
    </Box>
  )
}
