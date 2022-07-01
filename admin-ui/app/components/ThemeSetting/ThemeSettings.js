import React, { useContext } from 'react'
import clsx from 'clsx'
import { useMediaQuery } from 'react-responsive'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import SettingsIcon from '@material-ui/icons/Settings'
import { ThemeContext } from "Context/theme/themeContext"
import darkBlackThumbnail from 'Images/theme-thumbnail/darkBlack.jpg'
import darkBlueThumbnail from 'Images/theme-thumbnail/darkBlue.jpg'
import lightBlueThumbnail from 'Images/theme-thumbnail/lightBlue.jpg'
import lightGreenThumbnail from 'Images/theme-thumbnail/lightGreen.jpg'

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  whiteColor: {
    color: '#FFFFFF',
    position: 'relative',
  },
  selectContainer: {
    textAlign: 'center',
    marginTop: '30%'
  },
  selectItem: {
    marginBottom: 20,
    cursor: 'pointer',
    paddingTop: 16,
  },
  selectedItem: {
    background: '#eaeaea',
  },
  selectImage: {
    width: '75%',
  },
  selectTitle: {
    fontSize: 16,
    fontWeight: '600'
  }
})

export function ThemeSettings() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const theme = useContext(ThemeContext)
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  const onChangeTheme = (value) => {
    theme.dispatch({ type: value })
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
