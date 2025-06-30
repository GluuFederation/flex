import React, { useContext } from 'react'
import clsx from 'clsx'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import SettingsIcon from '@mui/icons-material/Settings'
import { ThemeContext } from 'Context/theme/themeContext'
import darkBlackThumbnail from 'Images/theme-thumbnail/darkBlack.jpg'
import darkBlueThumbnail from 'Images/theme-thumbnail/darkBlue.jpg'
import lightBlueThumbnail from 'Images/theme-thumbnail/lightBlue.jpg'
import lightGreenThumbnail from 'Images/theme-thumbnail/lightGreen.jpg'
import styles from './styles'

interface UserInfo {
  inum?: string
  [key: string]: any
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
  const themeContext = useContext(ThemeContext) as any

  const themeList: ThemeListItem[] = [
    { value: 'darkBlack', thumbnail: darkBlackThumbnail, text: 'Dark Black' },
    { value: 'darkBlue', thumbnail: darkBlueThumbnail, text: 'Dark Blue' },
    { value: 'lightBlue', thumbnail: lightBlueThumbnail, text: 'Light Blue' },
    { value: 'lightGreen', thumbnail: lightGreenThumbnail, text: 'Light Green' },
  ]
  const existingConfig = JSON.parse(localStorage.getItem('userConfig') || '{}')
  const lang = existingConfig?.lang || {}
  const theme = existingConfig?.theme || {}

  const onChangeTheme = (value: string) => {
    const { inum } = userInfo

    if (inum) {
      theme[inum] = value
    }

    const newConfig = { lang, theme }
    localStorage.setItem('userConfig', JSON.stringify(newConfig))

    themeContext.dispatch({ type: value })
    return
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
              [classes.selectedItem]: themeContext.state.theme === text.value,
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
        <SettingsIcon style={{ color: 'white', width: '35px', height: '100%' }} />
      </button>
      <Drawer anchor={'right'} open={open} onClose={toggleDrawer(false)}>
        {list('right')}
      </Drawer>
    </React.Fragment>
  )
}
