import React, { useContext } from 'react'
import clsx from 'clsx'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import { ThemeContext } from 'Context/theme/themeContext'
import darkBlackThumbnail from 'Images/theme-thumbnail/darkBlack.jpg'
import lightBlueThumbnail from 'Images/theme-thumbnail/lightBlue.jpg'
import settingsIcon from 'Images/svg/settings-icon.svg'
import styles from './styles'

interface UserInfo {
  inum?: string
  [key: string]: string | undefined
}

interface ThemeSettingsProps {
  userInfo: UserInfo
}

interface ThemeListItem {
  value: string
  thumbnail: string
  text: string
}

export function ThemeSettings({ userInfo }: ThemeSettingsProps) {
  const { classes } = styles()
  const [open, setOpen] = React.useState(false)
  const themeContext = useContext(ThemeContext)

  const currentTheme = React.useMemo(() => {
    return themeContext?.state?.theme || 'light'
  }, [themeContext?.state?.theme])

  const iconFilter = React.useMemo(() => {
    if (currentTheme === 'dark') {
      return 'brightness(0) invert(1)'
    }
    return 'brightness(0) saturate(100%) invert(26%) sepia(9%) saturate(1234%) hue-rotate(182deg) brightness(96%) contrast(89%)'
  }, [currentTheme])

  const themeList: ThemeListItem[] = [
    { value: 'light', thumbnail: lightBlueThumbnail, text: 'Light Theme' },
    { value: 'dark', thumbnail: darkBlackThumbnail, text: 'Dark Theme' },
  ]

  const onChangeTheme = (value: string) => {
    const existingConfig = JSON.parse(localStorage.getItem('userConfig') || '{}')
    const lang = existingConfig?.lang || {}
    const theme = existingConfig?.theme || {}

    const { inum } = userInfo
    if (inum) {
      theme[inum] = value
    }

    const newConfig = { lang, theme }
    localStorage.setItem('userConfig', JSON.stringify(newConfig))

    if (themeContext) {
      themeContext.dispatch({ type: value })
    }
  }

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      'key' in event &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setOpen(open)
  }

  const list = (anchor: 'left' | 'right' | 'top' | 'bottom') => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box className={classes.selectContainer}>
        <Box className={classes.selectInfo}>Choose Theme: </Box>
        {themeList.map((text) => (
          <Box
            className={clsx(classes.selectItem, {
              [classes.selectedItem]: themeContext?.state?.theme === text.value,
            })}
            onClick={() => onChangeTheme(text.value)}
            key={text.value}
          >
            <img
              className={classes.selectImage}
              src={text.thumbnail}
              alt={`thumbnail-${text.value}`}
            />
            <div className={classes.selectTitle}>{text.text}</div>
          </Box>
        ))}
      </Box>
    </div>
  )

  return (
    <React.Fragment>
      <button onClick={toggleDrawer(true)} className={classes.settingsToggeleBtn}>
        <img
          src={settingsIcon}
          alt="Settings"
          style={{
            width: '32px',
            height: '32px',
            display: 'block',
            filter: iconFilter,
          }}
        />
      </button>
      <Drawer anchor={'right'} open={open} onClose={toggleDrawer(false)}>
        {list('right')}
      </Drawer>
    </React.Fragment>
  )
}
