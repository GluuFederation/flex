import React, { useContext } from 'react'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import SettingsIcon from '@material-ui/icons/Settings'
import { ThemeContext } from "Context/theme/themeContext"
import darkBlackThumbnail from 'Images/theme-thumbnail/darkBlack.jpg'
import darkBlueThumbnail from 'Images/theme-thumbnail/darkBlue.jpg'
import lightBlueThumbnail from 'Images/theme-thumbnail/lightBlue.jpg'
import lightGreenThumbnail from 'Images/theme-thumbnail/lightGreen.jpg'
import styles from './styles'

export function ThemeSettings() {
  const classes = styles()
  const [open, setOpen] = React.useState(false)
  const theme = useContext(ThemeContext)

  const onChangeTheme = (value) => {
    theme.dispatch({ type: value })
    return
  }

  const themeList = [
    { value: 'darkBlack', thumbnail: darkBlackThumbnail, text: 'Dark Black' }, 
    { value: 'darkBlue', thumbnail: darkBlueThumbnail, text: 'Dark Blue' }, 
    { value: 'lightBlue', thumbnail: lightBlueThumbnail, text: 'Light Blue' }, 
    { value: 'lightGreen', thumbnail: lightGreenThumbnail, text: 'Light Green' },
  ]

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setOpen(open)
  }

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box className={classes.selectContainer}>
        <Box className={classes.selectInfo}>Choose Theme: </Box>
        {themeList.map(text => (
          <Box 
            className={clsx(classes.selectItem, {
              [classes.selectedItem]: theme.state.theme === text.value
            })} 
            onClick={() => onChangeTheme(text.value)} 
            key={text.value}
          >
            <img className={classes.selectImage} src={text.thumbnail} alt={`thumbnail-${text.value}`} />
            <div className={classes.selectTitle}>{text.text}</div>
          </Box>
        ))}
      </Box>
    </div>
  )

  return (
    <React.Fragment>
      <Button onClick={toggleDrawer(true)} className={classes.whiteColor}>
        <SettingsIcon />
      </Button>
      <Drawer className={classes.drawerContainer} anchor={'right'} open={open} onClose={toggleDrawer(false)}>
        {list('right')}
      </Drawer>
    </React.Fragment>
  )
}
